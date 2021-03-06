<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [puppeteer](./puppeteer.md) &gt; [Protocol](./puppeteer.protocol.md) &gt; [Tracing](./puppeteer.protocol.tracing.md) &gt; [TracingCompleteEvent](./puppeteer.protocol.tracing.tracingcompleteevent.md)

## Protocol.Tracing.TracingCompleteEvent interface

Signals that tracing is stopped and there is no trace buffers pending flush, all data were delivered via dataCollected events.

<b>Signature:</b>

```typescript
export interface TracingCompleteEvent 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [dataLossOccurred](./puppeteer.protocol.tracing.tracingcompleteevent.datalossoccurred.md) | boolean | Indicates whether some trace data is known to have been lost, e.g. because the trace ring buffer wrapped around. |
|  [stream](./puppeteer.protocol.tracing.tracingcompleteevent.stream.md) | [IO.StreamHandle](./puppeteer.protocol.io.streamhandle.md) | A handle of the stream that holds resulting trace data. |
|  [streamCompression](./puppeteer.protocol.tracing.tracingcompleteevent.streamcompression.md) | [StreamCompression](./puppeteer.protocol.tracing.streamcompression.md) | Compression format of returned stream. |
|  [traceFormat](./puppeteer.protocol.tracing.tracingcompleteevent.traceformat.md) | [StreamFormat](./puppeteer.protocol.tracing.streamformat.md) | Trace data format of returned stream. |

