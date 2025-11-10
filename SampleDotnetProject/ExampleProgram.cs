using System;
using MODULETECH;
using MODULETECH.Gen2;

namespace ImpinjReaderExample
{
    class Program
    {
        private static Reader reader;

        static void Main(string[] args)
        {
            Console.WriteLine("Impinj RFID Reader Example");
            Console.WriteLine("==========================");

            // Configuration - Update these values for your setup
            string readerIP = "192.168.0.250";  // Change to your reader's IP address
            Region region = Region.NA;          // Change to your region
            int antennaCount = 4;                 // Change to your reader's antenna count

            try
            {
                // Step 1: Create and connect to reader
                Console.WriteLine($"\nConnecting to reader at {readerIP}...");
                reader = Reader.Create(readerIP, region, antennaCount);
                Console.WriteLine("✓ Reader connected successfully");

                // Step 2: Configure reader parameters
                ConfigureReader();

                // Step 3: Perform operations
                Console.WriteLine("\n--- Synchronous Inventory Example ---");
                PerformSynchronousInventory();

                Console.WriteLine("\n--- Asynchronous Inventory Example ---");
                PerformAsynchronousInventory();

                // Step 4: Example tag operations
                Console.WriteLine("\n--- Tag Operations Example ---");
                PerformTagOperations();

            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n✗ Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
            finally
            {
                // Step 5: Cleanup
                if (reader != null)
                {
                    try
                    {
                        reader.Disconnect();
                        Console.WriteLine("\n✓ Reader disconnected");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error disconnecting: {ex.Message}");
                    }
                }
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }

        static void ConfigureReader()
        {
            // Configure which antennas to use
            int[] antennas = new int[] { 1, 2, 3, 4 };
            SimpleReadPlan readPlan = new SimpleReadPlan(antennas);
            reader.ParamSet("ReadPlan", readPlan);
            Console.WriteLine("✓ ReadPlan configured");

            // Optional: Set antenna power (example for antenna 1)
            // AntPower antPower = new AntPower(1, 3000, 3000); // 30dBm
            // reader.ParamSet("AntPower", antPower);
        }

        static void PerformSynchronousInventory()
        {
            try
            {
                Console.WriteLine("Starting synchronous inventory (2 seconds)...");
                TagReadData[] tags = reader.Read(2000);

                if (tags.Length == 0)
                {
                    Console.WriteLine("No tags found");
                }
                else
                {
                    Console.WriteLine($"Found {tags.Length} tag(s):");
                    foreach (TagReadData tag in tags)
                    {
                        Console.WriteLine($"  EPC: {tag.EPCString}");
                        Console.WriteLine($"    Antenna: {tag.Antenna}, RSSI: {tag.Rssi}, Read Count: {tag.ReadCount}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during inventory: {ex.Message}");
            }
        }

        static void PerformAsynchronousInventory()
        {
            try
            {
                // Register event handlers
                reader.TagsRead += OnTagsRead;
                reader.ReadException += OnReadException;

                // Configure asynchronous inventory
                BackReadOption backReadOption = new BackReadOption();
                backReadOption.ReadDuration = 1000;   // 1 second inventory cycle
                backReadOption.ReadInterval = 100;     // 100ms idle interval
                backReadOption.IsFastRead = false;
                reader.ParamSet("BackReadOption", backReadOption);

                Console.WriteLine("Starting asynchronous inventory (5 seconds)...");
                reader.StartReading();

                // Let it run for 5 seconds
                System.Threading.Thread.Sleep(5000);

                reader.StopReading();
                Console.WriteLine("Asynchronous inventory stopped");

                // Unregister event handlers
                reader.TagsRead -= OnTagsRead;
                reader.ReadException -= OnReadException;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during asynchronous inventory: {ex.Message}");
            }
        }

        static void OnTagsRead(object sender, TagsReadEventArgs e)
        {
            foreach (TagReadData tag in e.Tags)
            {
                Console.WriteLine($"  [Event] Tag: {tag.EPCString}, Antenna: {tag.Antenna}");
            }
        }

        static void OnReadException(object sender, ReadExceptionEventArgs e)
        {
            Console.WriteLine($"  [Event] Reader Exception: {e.ReaderException.Message}");
        }

        static void PerformTagOperations()
        {
            try
            {
                // First, find a tag
                Console.WriteLine("Finding a tag...");
                TagReadData[] tags = reader.Read(1000);

                if (tags.Length == 0)
                {
                    Console.WriteLine("No tags found. Cannot perform tag operations.");
                    return;
                }

                TagReadData firstTag = tags[0];
                Console.WriteLine($"Working with tag: {firstTag.EPCString}");

                // Example: Read TID bank
                Console.WriteLine("\nReading TID bank (2 words from address 0)...");
                ushort[] tidData = reader.ReadTagMemWords(null, MemBank.TID, 0, 2);
                string tidHex = ByteFormat.ToHex(tidData);
                Console.WriteLine($"  TID Data: {tidHex}");

                // Example: Read USER bank
                Console.WriteLine("\nReading USER bank (4 words from address 0)...");
                ushort[] userData = reader.ReadTagMemWords(null, MemBank.USER, 0, 4);
                string userHex = ByteFormat.ToHex(userData);
                Console.WriteLine($"  USER Data: {userHex}");

                // Example: Write to USER bank (commented out for safety)
                // Console.WriteLine("\nWriting to USER bank...");
                // ushort[] writeData = new ushort[] { 0x1234, 0x5678 };
                // reader.WriteTagMemWords(null, MemBank.USER, 0, writeData);
                // Console.WriteLine("  Write completed");

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during tag operations: {ex.Message}");
            }
        }
    }
}

