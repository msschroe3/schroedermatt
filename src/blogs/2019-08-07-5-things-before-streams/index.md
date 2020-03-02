---
path: "/5-things-to-know"
title: "5 Things to Know Before Using Kafka Streams"
date: "2019-08-07"
href: "https://objectpartners.com/2019/08/07/5-things-to-know-before-using-kafka-streams/"
summary: "5 things to know before diving head first into Kafka Streams."
---
The Kafka Streams API has been around since Apache Kafka v0.10 and as the adoption of Kafka booms, so does Kafka Streams. The Streams library enables developers to create distributed processing applications while avoiding most of the headaches that accompany distributed processing.
 

A few of the features packed into the Kafka Streams client library include:
 

Real-time, stateful, distributed processing (event-at-a-time rather than batch or micro-batch)
BYOC (Bring Your Own Cluster) Architecture – no need for a “processing cluster”
A DSL to satisfy most processing operations (map, filter, count, reduce, joins, windows, and abstractions of streams/tables)
Access to the Processor API when you need to dive deeper
Full integration with Kafka security
Elastic scalability, fault tolerance, exactly-once semantics (EOS), error handling, reprocessing capabilities, and more
 


Kafka Streams Topology

 

Now, before throwing all of your money at Kafka Streams (just kidding, it’s free), there are a few things you should know to set your team up for success.
1. Understand Kafka to Understand Kafka Streams
It’s in the name, so you might have inferred that Kafka Streams is built for Kafka. The library requires Kafka to be the data source and most streams will produce their output back to Kafka, although this is not a hard requirement. At the surface this may feel like a limitation but it’s the reason that Kafka Streams accomplishes so much (see features list above for a reminder). Other streaming solutions try to be agnostic to the underlying storage and end up bolting on features that end up falling short.

Kafka Streams has gone all-in on the fundamentals of Kafka. To ensure your success, take the time to learn/review the fundamentals as well. The documentation is great and there are plenty of Udemy courses to get you started. The Streams DSL is going to make more sense if you have a mental map of things like topics, partitions, offsets, replication, commits, acks, producers, consumer groups, serde (serialization/deserialization), and more.

2. Design for Exceptions
Full disclosure, my first streams app didn’t have exception handling. It was a POC and I was too exciting to see data flowing end to end in such a short amount of time! During the first live demo, a “poison pill” brought the app to its knees and I quickly started researching the options for handling exceptions in a Kafka Streams application.

As long as you’re running Apache Kafka 1.1+ (KIP-161 & KIP-210), there are two primary access points for handling exceptions in a Kafka Streams application. The first being during deserialization of incoming data from Kafka and the second being during the production of data back to Kafka.

The configurations for these are listed below:

default.deserialization.exception.handler: Depending on the criticality of each message being processed, your streams app can be configured to log errors and continue, or log errors and fail. If the out of the box implementations don’t cut it, you can implement your own DeserializationExceptionHandler.
default.production.exception.handler: The DefaultProductionExceptionHandler is configured to fail on any producer exception. Custom implementations of the ProductionExceptionHandler can be used. On exception, they are handed the record and thrown exception and expected to return a ProductionExceptionHandlerResponse (i.e. FAIL or CONTINUE).
You may notice that these only cover the entry and exit points of a streams application. Any errors that occur during the processing logic are left up to the stream. There are a couple of ways to go about this. You can try/catch in various points for detailed handling but that won’t always be possible so Kafka Streams also exposes an UncaughtExceptionHandler configuration that serves as the catch-all.

Here is an example of configuring the handler on the KafkaStreams instance.

KafkaStreams streams = new KafkaStreams(topology, config);

// other configurations

streams.setUncaughtExceptionHandler((Thread thread, Throwable throwable) -> {
   // examine the throwable and do something
});

streams.start();
view rawUncaughtExceptionHandlerExample.java hosted with ❤ by GitHub
For more details, check out Confluent’s FAQ on this topic.

3. Don’t Skimp on Tests
Just because you wrote your first Kafka Streams application in a day doesn’t mean it is exempt from tests. In fact, streams lend themselves very nicely to automated tests due to how closely they resemble pure functions. A record comes in, an operation (map, filter, join, etc) is applied, a record goes out; that is a very testable scenario.

The documentation for testing Kafka Streams is okay but lacks in certain areas. For example, if you are working with Avro data you will surely run into the scenario where your test boots up and tries to connect directly to Schema Registry. Whoops! To get around this, you’re going to have to plug in the MockSchemaRegistryClient or build your own abstraction layer. Another common area that developers churn on is testing stateful operations and/or joins. The streams test library does a nice job of exposing the state stores but I’ve put some samples on GitHub that may come in handy when you get to this point in your testing.

All of the same principals for writing testable code in APIs and other services apply to Kafka Streams.

4. Think About Stream Management
Management of Streams applications is a two-folded effort. The first being at an organizational level to manage where the streams will run, what they will have access to, how they get that access, and what data they’re producing.

Most of these questions point back to decisions that should have already been discussed. How are existing applications deployed and run? That same model can apply to these. How is the Kafka cluster managed? That should help in figuring out how topics are provisioned, access is distributed, and other key metrics and resources are exposed.

If this is the start of your Kafka journey, start thinking about these things. Streams will catch on like wildfire. Companies are starting to build tools like Stream Registry to help avoid recreating ESB antipatterns with Kafka.

Streams will catch on like wildfire.

The second piece of management is on the developer. Understanding what topics the application needs and how data is partitioned is critical to help avoid unintentional breaking changes. This is especially true when KTables enter the scene. My colleague wrote a great post detailing how to keep your stream slim and clean out unnecessary state (Slimming Down Your Kafka Streams Data) when that time comes.

5. Don’t Overdo It
The premise and power behind Kafka Streams is their functional nature and ability to scale. Keep streams slim and functional. Naturally, more and more business logic seeps into services over time. Try to recognize this and don’t be afraid to start new streams rather than falling into building a Monostream.

This post is by no means a comprehensive guide to streaming but hopefully it has given you the confidence to get started and spin up new streams when the next business case lands in your lap.

Conclusion
The area of distributed stream processing is competitive and still relatively young. However, if you’re already using Kafka, Kafka Streams is becoming the clear choice to handle your distributing processing needs because of the ways that it natively hooks into your Kafka cluster. The library offers a developer-friendly DSL and features like EOS, Fault Tolerance, and Replayability. On top of this, it can run on your existing infrastructure. This is the tipping point for many to give it a shot, because why not?

Like all things, do your research to make sure it’s a good fit for the problems that you’re solving for. Check out the use cases section to get your mind streaming and reach out if you’d like to know more.