import { Buffer } from 'node:buffer';

/**
 * Decodes a FIT file buffer into structured message data.
 *
 * @param fileBuffer - The raw FIT file data as a Uint8Array
 * @returns Promise resolving to decoded messages object or error information
 */
export async function decodeFitFile(fileBuffer: Uint8Array): Promise<any> {
  console.log('✅ decodeFitFile() called...');
  console.log(fileBuffer);
  try {
    console.log('📂 Received fileBuffer of length:', fileBuffer.length);

    // ✅ Import `@garmin-fit/sdk` dynamically

    const { Decoder, Stream } = await import('@garmin/fitsdk').then(mod => ({
      Decoder: mod.Decoder,
      Stream: mod.Stream,
    }));
    console.log('✅ Garmin FIT SDK imported successfully');

    // ✅ Convert Uint8Array to Buffer
    const buffer = Buffer.from(fileBuffer);
    console.log('✅ Converted Uint8Array to Buffer');

    // ✅ Use `Stream.fromBuffer()` instead of `new Stream(buffer)`
    const stream = Stream.fromBuffer(buffer);
    console.log('✅ Created FIT stream using Stream.fromBuffer()');

    // ✅ Create FIT decoder
    const decoder = new Decoder(stream);
    console.log('✅ FIT decoder initialized');

    // ✅ Check file integrity before reading
    if (!decoder.checkIntegrity()) {
      console.error('❌ FIT file integrity check failed!');
      return { error: 'FIT file integrity check failed' };
    }
    console.log('✅ FIT file integrity check passed');

    // ✅ Decode file
    console.log('🔄 Decoding FIT file...');
    const { messages, errors } = decoder.read({
      applyScaleAndOffset: true,
      expandSubFields: true,
      expandComponents: true,
      convertTypesToStrings: true,
      convertDateTimesToDates: true,
      includeUnknownData: false,
      mergeHeartRates: true,
    });

    console.log('✅ FIT file decoding complete');

    // ✅ LOG ERRORS PROPERLY
    if (errors.length > 0) {
      console.error(
        '⚠️ Decoding errors occurred:',
        JSON.stringify(errors, null, 2)
      );
      return {
        error: 'Decoding errors occurred',
        details: JSON.stringify(errors, null, 2),
      };
    }

    // ✅ Ensure messages are correctly formatted
    if (!messages || Object.keys(messages).length === 0) {
      console.error('❌ No messages decoded, possible issue with FIT file.');
      return {
        error: 'No valid messages decoded, FIT file might be corrupted.',
      };
    }

    console.log('✅ Decoded Messages:', JSON.stringify(messages, null, 2));
    return messages;
  } catch (error) {
    console.error('❌ Error decoding FIT file:', error);
    return { error: 'Failed to decode file', details: error.toString() };
  }
}
