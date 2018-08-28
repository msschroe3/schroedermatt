---
path: "/kotlin-features-for-kafka"
title: "3 Kotlin Features to Improve Your Kafka Connect Development"
date: "2018-08-14"
href: "https://objectpartners.com/2018/08/14/3-kotlin-features-to-improve-your-kafka-connect-development/"
summary: "Kotlin is on the rise, so why not use it to build your next Kafka Connector? Here are a few reasons to convince you."
---

Kafka Connect is the hub that connects your Kafka cluster to any other system. The framework aims to make it easy to pull data into Kafka as well as copy data out of Kafka. As mentioned in a previous post on building a Kafka Connector with Gradle, there are a variety of open source connectors available for use but there are still use cases that will require the development of a custom connector.

If you find yourself starting from scratch, here are a few reasons to consider Kotlin as your language of choice.

### 1) Eliminate Boilerplate Code with Data Classes

Kafka connectors have a relatively simple task. They either fetch data from a source and push it to Kafka (source connector) or pull data from Kafka and sync it to a system (sink connector).

Both types of connectors require a fair amount of mapping data to and from domain models. Kotlin’s data classes provide a streamlined way of defining objects and leaving out the boilerplate code traditionally found in POJOs. Data classes also provide ways to copy and destructure objects should the need arise.

Here’s a comparison of a data class and a traditional POJO (that doesn’t include all of the properties/functionality that the data class has).

```java
// kotlin data class (equals/hashcode/copy available)
data class Song (val name: String, val artist: Artist, var length: Int?)
  
// pojo with 1 of the Song properties for brevity (and no equals/hashcode)
public class Song {
  private String name;

  public Song(String name) {
    this.name = name;
  }

  public String getName() {
    return name;  
  }
  
  public void setName(String name) {
	  this.name = name;
  }
}
```

### 2) Cleanup Struct Conversion with Extension Methods

Many times the data source you want to interact with has a library you can use to jumpstart development. In this case, you won’t have control over the domain models and end up writing a variety of helper functions to convert the models to and from the Struct objects that Kafka expects so that Avro and the Schema Registry can be used.

Kotlin’s extension methods provide a nice way to tack on functionality to a class and keep your code clear of helper clutter.

Here’s an example of adding a toStruct method to a model pulled in from a 3rd party library.

```kotlin
// extension on model from 3rd party library
fun ArtistModel.toStruct() : Struct = Struct(Artist.SCHEMA)
        .put(BaseSchema.HREF_FIELD, this.href)
        .put(BaseSchema.ID_FIELD, this.id)
        .put(BaseSchema.NAME_FIELD, this.name)

// example when creating list of SourceRecords from result set
val results: List<ArtistModel> = client.getResults()
results.map {
  SourceRecord(partition, offset, topic, keySchema, it.id, valueSchema, it.toStruct())
}
```

### 3) Java Interoperability

Java is the dominant language in the Kafka space so being able to [pull in Java libraries](https://kotlinlang.org/docs/reference/java-interop.html) or [experiment with Kotlin in a Java project](https://kotlinlang.org/docs/reference/java-to-kotlin-interop.html) is one of the most powerful features that Kotlin offers. If you are trying to introduce Kotlin to your team, there is no problem bringing it in one class at a time so that you can show off some of the other features that Kotlin users love.

* Eliminate NPE’s with null safety
* Clean type checks and casts
* Default argument support
* Higher order functions and Lambdas 


*Disclaimer: Once you start writing Kotlin you may start to notice more and more .kt files appearing in your project.*