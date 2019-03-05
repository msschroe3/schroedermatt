---
path: "/spring-kafka-retry"
title: "Building Resilient Kafka Consumers with Spring Retry"
date: "2018-11-21"
href: "https://objectpartners.com/2018/11/21/building-resilient-kafka-consumers-with-spring-retry/"
summary: "A guide to integrating Spring Retry into a Kafka Consumer to increase durability."
---
When building out applications around a Kafka cluster one of the most critical considerations is how failures are handled. Kafka does a nice job of decoupling systems but there are still many opportunities for things to go wrong while processing data. Producers can automatically retry sending records if an ack is not received from a broker but there are still issues that can occur while processing data that you will be responsible for.

Here are a few scenarios to think about as you’re writing a Kafka consumer. The majority of this post will be spent diving into the 3rd scenario of handling transient errors by configuring Spring Retry.

## Scenario 1) Hey, don’t change that!

Data changes, this is just a fact of life as an engineer. Kafka handles your data as bytes coming in and bytes going out so that leaves it up to clients to handle changes in data formats. This may mean adding sufficient catches around deserialization or forcing new topics for incompatibility issues but solutions like these can quickly lead to unmanageable code. Avro enters the scene and a lot of these serde issues are minimized but there are still plenty of gotchas when managing an enterprise scale Schema Registry. The good news with all of these failures is that Kafka gives us the luxury of “do-overs” by replaying messages after fixing whatever issue you may have encountered. With that said, it’s still not a fun exercise to go through so do some upfront design and research on modeling your data for Kafka. For a more comprehensive introduction into Avro, check out [this blog](https://medium.com/@stephane.maarek/introduction-to-schemas-in-apache-kafka-with-the-confluent-schema-registry-3bf55e401321).

## Scenario 2) Death of the consumer

Your consumer goes down in flames, yet another thing that is bound to happen during your Kafka journey. With Kafka’s default behavior of automatically committing offsets every 5 seconds, this may or may not be an issue. If the consumer fails within the 5 seconds, the offset will remain uncommitted and the message will be reprocessed when the consumer starts back up. If the consumer locks up or a network request takes longer than expected, the offset will get committed and Kafka will think you’ve processed the message even if that’s not the case. The easiest way to mitigate this scenario is to handle your offsets manually. Set enable.auto.commit to false and explicitly acknowledge the message only when you are sure you’ve successfully done what you need to do with each message.

## Scenario 3) API, are you there?

As mentioned before there is no way to completely decouple applications. Typically you are consuming messages from a topic, processing it, and handing it off to another service (e.g. database, API, another topic, etc). This may be a service that your team owns or a third party service. Either way, transient failures and downtime should be anticipated rather than a surprise when they inevitably happen. If a request fails with a 503 (Service Unavailable) or something similar you might not want to just set the message aside and process the next one because it will likely fail for the same reason. Instead, maybe you pause for a second and retry the message however many times you see fit before eventually dumping it to a dead letter topic as you don’t want to hold up processing indefinitely.

There are a few approaches you can take to solving this but [Spring Retry](https://github.com/spring-projects/spring-retry), an existing Spring project, is utilized in Spring Kafka to help retry these failures with some simple configuration.

# Spring Retry

Before getting to how Spring Kafka integrated Spring Retry, let’s first look at the library itself to understand how it can be utilized in any project. More details can be found in the [spring-retry](https://github.com/spring-projects/spring-retry) documentation.

## Define a Retry Template

The RetryTemplate handles executing operations with the provided retry semantics. Retryable operations are encapsulated in implementations of the RetryCallback interface and are executed using one of the given execute methods on RetryTemplate. Here is a code snippet showing the configuration of a reusable retry template and how to a wrap an operation with it.

```groovy
@Bean
RetryTemplate retryTemplate() {
  RetryTemplate retryTemplate = new RetryTemplate()

  FixedBackOffPolicy fixedBackOffPolicy = new FixedBackOffPolicy()
  fixedBackOffPolicy.setBackOffPeriod(1000l)
  retryTemplate.setBackOffPolicy(fixedBackOffPolicy)

  SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy()
  retryPolicy.setMaxAttempts(2)
  retryTemplate.setRetryPolicy(retryPolicy)

  return retryTemplate
}


// example usage (could be replaced with lambda)
retryTemplate.execute(new RetryCallback<Void, RuntimeException>() {
    @Override
    public Void doWithRetry(RetryContext ctx) {
        someService.fetchData();
        ...
    }
});
```

By default, an operation is retried anytime a subclass of Exception is thrown but this behavior is configurable via a RetryPolicy.

Also by default, each operation can be retried a maximum of three times with zero back off in between. Using RetryPolicy and BackoffPolicy, these can be overridden. The following sections will help you customize your RetryTemplate to fit your needs.

## Configure Retry Policy

Select a RetryPolicy that suits your needs and supply it when building the RetryTemplate. This is what will determine whether or not a retry of the operation should be attempted.

### Policies

```text
AlwaysRetryPolicy: A subclass of NeverRetryPolicy that is mainly used as a base for other policies (e.g. a test stub)
CircuitBreakerRetryPolicy: Trips circuit open after a given number of failures and stays open until a set timeout elapses
CompositeRetryPolicy: mix and match multiple policies (they will be called in the order given)
ExceptionClassifierRetryPolicy: specify different policies for different exception types
ExpressionRetryPolicy: subclass of SimpleRetryPolicy that evaluates an expression against the last thrown exception
NeverRetryPolicy: allows the first attempt but never permits a retry
SimpleRetryPolicy: retry a fixed number of times for a set of named exceptions (and subclasses)
TimeoutRetryPolicy: allows a retry as long as it hasn’t timed out (clock is started on a call to RetryContext)
```

## Configure Backoff Retry Policy

Select the BackoffPolicy and supply it when building your RetryTemplate. This designates how the template should space out retries.

### Policies

```text
ExponentialBackOffPolicy: increases back off period exponentially. The initial interval and multiplier are configurable.
ExponentialRandomBackoffPolicy: chooses a random multiple of the interval that would come from a simple deterministic exponential. This has shown to at least be useful in testing scenarios where excessive contention is generated by the test needing many retries.
FixedBackOffPolicy: pauses for a fixed period of time (using Sleeper.sleep(long)) before continuing.
NoBackOffPolicy: performs all retries one after the other without pause
UniformRandomBackOffPolicy: pauses for random period of time before continuing
view rawBackoffPolicies.txt hosted with ❤ by GitHub
```

### Implement a RecoveryCallback

If your operation exhausts all of its retries, a RecoveryCallback can be notified of this and do the final processing on this failed operation. This may include logging the failure, publishing a notification, making an update to an errored records table, and many other things.

## Configuring Spring Retry in Spring Kafka Project

Spring Kafka has built-in adapters for Spring Retry that make it painless to use. When configuring the listener container factory you can provide a RetryTemplate as well as RecoveryCallback and it will utilize the RetryingMessageListenerAdapter to wrap up the listener with the provided retry semantics.

The caveat to this is that batch message listeners can’t support an adapter because there is no way for the framework to know where in the batch of messages the listener failed. However, you could still manually implement the RetryTemplate as described in the previous sections and wrap retriable operations yourself. This also holds true for projects not using Spring Kafka.

Reusing the RetryTemplate configuration from the previous snippet, here’s how to plug it into a Spring Kafka listener container factory.

```groovy
@Bean
public KafkaListenerContainerFactory kafkaListenerContainerFactory(RetryTemplate retryTemplate) {
  def factory = /** configure factory **/
  
  // configure the listener container factory with retry support
  factory.setRetryTemplate(retryTemplate);
  factory.setRecoveryCallback(context -> {
    log.error("RetryPolicy limit has been exceeded! You should really handle this better.");
    return null;
  });

  return factory;
}
```

To learn more about Spring Retry and how it can help you build more resilient consumers, check out the [docs](https://docs.spring.io/spring-kafka/reference/htmlsingle/#retrying-deliveries) or this [integration test](https://github.com/msschroe3/spring-kafka-samples/blob/master/src/test/groovy/com/mschroeder/kafka/listener/RetryListenerSpec.groovy) illustrating the use of retries.