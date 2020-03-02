---
path: "/why-kafka"
title: "Why Is Everyone Talking About Kafka?"
date: "2019-03-13"
href: "https://objectpartners.com/2019/03/13/why-is-everyone-talking-about-kafka/"
summary: "By walking through a set of 4 questions, we can gain a better understanding of why everyone is talking about Apache Kafka."
---
Fending off buzzwords can feel like a full-time job, so having a reliable approach to assessing technologies is a critical piece of an engineer’s toolkit. With the rise of Kafka, more and more companies are trying to figure out why there has been so much momentum behind it and if they should be evaluating it.

By walking through a set of 4 questions, we will gain a better understanding of Kafka’s position in an organization’s tech stack.

What does it do?
This may seem like an obvious question to ask yourself but it’s important to know the real intent of a technology before making any assumptions about it.

Kafka behaves like a publisher/subscriber (pub/sub) system. Messages are sent to topics by producers and available for consumption by downstream consumers. The diagram below illustrates the architecture with a caveat around consumer behavior. Traditional messaging systems push messages to all subscribers immediately while Kafka flips this and forces consumers to poll for new data on their own terms. As we will see in later sections, this change in architecture leads to a handful of benefits.


https://aws.amazon.com/pub-sub-messaging/

Where Apache Kafka starts to differentiate itself is in some of the guarantees and properties that it provides –

Message Ordering: Messages produced to a particular topic partition will be appended in the order they are sent. On the consumer side of things, a consumer will receive the records in the order they are stored in the log.
Reliability: A topic that replicates its data N times can tolerate up to N-1 server failures without losing data.
Durability: Messages are stored in a log file, replicated, and do not get erased until the retention period elapses. Consuming a message does not mean that the message is removed. If you want, you can consume a topic as many times as you’d like.
Scalability: Topics can partition their data to allow for consumers to read messages in parallel. A consumer reading from a topic with N partitions could have up to N processes reading the data at the same time.
Exactly Once Processing: Kafka has capabilities to guarantee that messages are processed once.
 

Who built it?
The origination of a technology shouldn’t be the main driver behind adoption but it does help in gaining a sense of trust in its quality and longevity.



The origin story for Kafka comes courtesy of LinkedIn. Once again, being backed by a large company isn’t reason enough to invest in a technology but it does help to know that they have the resources to build out and support it. It’s also a good sign to see how heavily they have adopted it (LinkedIn hits 1 trillion messages per day). Also, Kafka’s open source presence continues to grow and companies like Confluent and others are forming with Kafka at the core of its business model.

Why did they build it?
It’s always interesting to dig into what problems the creator was trying to solve when the tool was built. It provides a quick start to thinking about the problems that it can solve within your organization but should by no means act as the guard rails to its potential applications.

Like most companies, LinkedIn had a need to break down data silos to enable better access and analytics across the board. Existing products in the market (which will be discussed in the next section) addressed some requirements better than others but none of them explicitly provided the guarantees that they needed. Furthermore, Kafka was developed towards the forefront of the “microservice” movement and played really nicely into enabling an event-driven architecture within the organization by decoupling services.

How does it compare to other products?
Rightfully so, this is usually the question that gets the most discussion. What makes this better than xyz?

To answer this, we have to look at Kafka from a few different angles to see who the competitors are.

Kafka as a Messaging Tool
When looking at the tools that are closest to Kafka they usually get bucketed as either a “queue” or a “pub/sub messaging” tool. Let’s look at both of these and then how Kafka fits in.

Queue: Messages are placed on a queue and available for a single subscriber due to the fact that once a message is read, it’s gone. That’s not to say the subscriber can’t scale out the same process against a queue, but it can’t have multiple subscribers see each message on the queue.
Pub/Sub: Although these tools allow for multiple subscribers, most fall down when scaling out due to the amount of responsibility on the message broker to handle subscribers and send every message to every subscriber. This also poses problems when subscribers can’t accept messages because they are down or falling behind due to load.
Kafka: Consumers can scale out to process in parallel via consumer groups (a collection of consumer processes joined by a common group identifier). Multiple consumer groups can consume the same data without having to duplicate it or worry about data being removed after a read. Kafka provides the scalability of Queues as well as the multi-subscriber features of a Pub/Sub system. Kafka also provides better ordering guarantees without having to use the notion of an “exclusive consumer”. Lastly, consumers poll for data so if they’re down it’s not a big deal. As soon as they come back up, they can continue consuming data at whatever pace they choose.
Kafka as a Storage Tool
Most message queue systems act as storage for “in-flight” messages and once they’re consumed, they’re cleared out. Many of the benefits illustrated above regarding Kafka as a messaging system are due to that fact that it is first and foremost a great storage system.

Storage is at the core of Kafka with data being written to disk and replicated. Publishers of data can wait for different levels of guarantees (acknowledgments) that their data has been persisted AND replicated. Consumers completely drive their read position, so Kafka in a way is just managing a distributed file system of logs.

At the 2018 Kafka Summit, Martin Kleppman went as far as exploring the idea that Kafka could be considered a database due to many of the properties it exhibits.

Kafka as a Stream Processing Tool
Producing, storing, and consuming Kafka messages is great, but maybe not great enough to warrant a complete pivot in architecture to gain some of the benefits of Kafka.

Distributed file systems allow for static files to be used in batch processing (i.e. processing of historical data in batches). Traditional messaging systems allow for the processing of future messages that arrive after you are subscribed. Kafka combines both of these to allow for streams applications to process historical data as well as new data as it arrives (i.e. real time).

On top of the core Kafka components that enable the messaging and storage functionality, a huge selling point of Kafka is the streaming client library that it offers. This library solves a lot of the hard problems like handling out of order data, reprocessing, stateful computations, joining across data streams, etc. At its core, the Kafka Streams Processing API builds on top of the core Kafka primitives from utilizing consumers/producers, topics for stateful storage, and consumer groups for scalability. The amount of dogfooding that can be found around the Kafka ecosystem is a testament to their architecture.

Conclusion
The truth is if you’re serious about adopting a technology like Kafka you are not going to have a complete answer with just these 4 questions. However, you are in a much better position to continue evaluating or set it aside for another time.

To move forward with an evaluation, you might consider going deeper into –

Who is selling it and what is the pricing model?
What is the cost to build yourself & maintain?
What are the pain points? (A Stack Overflow search can give an idea of this)
What technologies/languages/tooling will developers need to learn?
How does it fit into the existing tech stack?
What language is the technology written in?
Do we have business cases down the road that could tie into this?
and many more…