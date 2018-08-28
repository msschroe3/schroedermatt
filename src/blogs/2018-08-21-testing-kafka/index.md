---
path: "/spring-kafka-mockschemaregistryclient"
title: "Testing with Spring Kafka and MockSchemaRegistryClient"
date: "2018-08-21"
href: "https://objectpartners.com/2018/08/21/testing-with-spring-kafka-and-mockschemaregistryclient"
summary: "An overview of the options when trying to test a Kafka cluster that utilizes Avro and Schema Registry."
---
Spring Kafka provides a variety of testing utilities to make writing integration tests easier. Most notably, the @EmbeddedKafka annotation spins up an embedded broker (and zookeeper) available for tests. The address of the broker is set to the ${spring.embedded.kafka.brokers} property so that you can configure your consumers and producers appropriately. If you aren’t familiar with Spring Kafka’s testing package, go check out the [documentation](https://github.com/msschroe3/spring-kafka-listener).

EmbeddedKafka is a great tool for many tests but it falls flat when dealing with Avro data because of the absence of Schema Registry support. However, there are a few of options that I have explored to get around this.

* Run the entire Kafka stack in a docker environment and execute tests against it.
* Port the [EmbeddedSingleNodeKafkaCluster](https://github.com/confluentinc/kafka-streams-examples/blob/d8edc99a5f5c5018310cdfe683e684916afea3ac/src/test/java/io/confluent/examples/streams/kafka/EmbeddedSingleNodeKafkaCluster.java) that Confluent has engineered for their testing samples. As of writing this, it sounds like there are [plans to publish a core-test-utils artifact](https://github.com/confluentinc/kafka-streams-examples/issues/26) so keep your eyes out for that. This is a nice embedded solution that includes a broker, zookeeper, AND schema registry client along with some other useful features.
* Utilize the [MockSchemaRegistryClient](https://github.com/confluentinc/schema-registry/blob/master/client/src/main/java/io/confluent/kafka/schemaregistry/client/MockSchemaRegistryClient.java) that Confluent has made available in place for the `CachedSchemaRegistryClient` that is used by default.

Being that I didn’t need a full-fledged docker environment and wasn’t keen on porting a bunch of code, I implemented option #3. Here is the configuration I came up with so that my integration tests use an embedded Kafka broker and `MockSchemaRegistryClient`.

## Test Properties
Spring Kafka exposes a set of properties that can be used to configure producer, consumer, and admin Kafka clients. These same properties come in handy when setting up a test environment.

The main thing to note in the properties shown below is that bootstrap-servers is set to `${spring.embedded.kafka.brokers}` so that clients created for tests use the embedded broker. The `schema.registry.url` property is required but can be any value since the MockSchemaRegistryClient won’t use it.

```yaml
spring:
  kafka:
    # point the bootstrap servers to the running embedded kafka
    bootstrap-servers: ${spring.embedded.kafka.brokers}
    consumer:
      client-id: test-avro-consumer
      group-id: test-avro-group
      value-deserializer: io.confluent.kafka.serializers.KafkaAvroDeserializer
    producer:
      value-serializer: io.confluent.kafka.serializers.KafkaAvroSerializer
    properties: # for KafkaAvroDeserializer
      # this value isn’t used but is still required
      schema.registry.url: http://mock:8081
      specific.avro.reader: true
```

## MockSchemaRegistryClient Configuration
To enable the MockSchemaRegistryClient in our serialization and deserialization there are a few beans that have to be defined in the test project. The comments throughout the gist below illustrate what the bean is and why it’s needed.

```groovy
@Configuration
class MockSerdeConfig {
   // KafkaProperties groups all properties prefixed with `spring.kafka`
   private KafkaProperties props
   MockSerdeConfig(KafkaProperties kafkaProperties) {
      props = kafkaProperties
   }

   /**
    * Mock schema registry bean used by Kafka Avro Serde since
    * the @EmbeddedKafka setup doesn't include a schema registry.
    * @return MockSchemaRegistryClient instance
    */
   @Bean
   MockSchemaRegistryClient schemaRegistryClient() {
      new MockSchemaRegistryClient()
   }

   /**
    * KafkaAvroSerializer that uses the MockSchemaRegistryClient
    * @return KafkaAvroSerializer instance
    */
   @Bean
   KafkaAvroSerializer kafkaAvroSerializer() {
      new KafkaAvroSerializer(schemaRegistryClient())
   }

   /**
    * KafkaAvroDeserializer that uses the MockSchemaRegistryClient.
    * The props must be provided so that specific.avro.reader: true
    * is set. Without this, the consumer will receive GenericData records.
    * @return KafkaAvroDeserializer instance
    */
   @Bean
   KafkaAvroDeserializer kafkaAvroDeserializer() {
      new KafkaAvroDeserializer(schemaRegistryClient(), props.buildConsumerProperties())
   }

   /**
    * Configures the kafka producer factory to use the overridden
    * KafkaAvroDeserializer so that the MockSchemaRegistryClient
    * is used rather than trying to reach out via HTTP to a schema registry
    * @return DefaultKafkaProducerFactory instance
    */
   @Bean
   DefaultKafkaProducerFactory producerFactory() {
      new DefaultKafkaProducerFactory(
            props.buildProducerProperties(),
            new StringSerializer(),
            kafkaAvroSerializer()
      )
   }

   /**
    * Configures the kafka consumer factory to use the overridden
    * KafkaAvroSerializer so that the MockSchemaRegistryClient
    * is used rather than trying to reach out via HTTP to a schema registry
    * @return DefaultKafkaConsumerFactory instance
    */
   @Bean
   DefaultKafkaConsumerFactory consumerFactory() {
      new DefaultKafkaConsumerFactory(
            props.buildConsumerProperties(),
            new StringDeserializer(),
            kafkaAvroDeserializer()
      )
   }

   /**
    * Configure the ListenerContainerFactory to use the overridden
    * consumer factory so that the MockSchemaRegistryClient is used
    * under the covers by all consumers when deserializing Avro data.
    * @return ConcurrentKafkaListenerContainerFactory instance
    */
   @Bean
   ConcurrentKafkaListenerContainerFactory kafkaListenerContainerFactory() {
      ConcurrentKafkaListenerContainerFactory factory = new ConcurrentKafkaListenerContainerFactory()
      factory.setConsumerFactory(consumerFactory())
      return factory
   }
}
```

## Dependencies
To start using the Spring Kafka embedded broker alongside a MockSchemaRegistryClient, the dependencies in the snippet below should be added to your existing build.gradle. To pull any io.confluent packages you will have to add Confluent’s maven repository.

```
repositories {
   maven {
      url "http://packages.confluent.io/maven/"
   }
}

compile 'org.springframework.kafka:spring-kafka’
compile "org.apache.avro:avro”
compile "io.confluent:kafka-avro-serializer
testCompile 'org.springframework.kafka:spring-kafka-test'
```

## Conclusion
With spring-kaka-test in the mix and a few additional bean configurations, you can start adding valuable test coverage to any Kafka client application that relies on Avro and the Schema Registry!

[Full Sample Project](https://github.com/msschroe3/spring-kafka-listener)

