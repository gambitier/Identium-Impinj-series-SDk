# Impinj RFID Reader SDK - Integration Guide

## Overview

This package contains the **documentation** for the ModuleAPI C# SDK for Impinj RFID readers. The SDK provides a C# API to interact with Impinj RFID readers for tag inventory, reading, writing, and configuration operations.

## What You Need

### 1. SDK DLL Files
You need to obtain the actual SDK DLL files from your provider:
- **ModuleAPI.dll** - For Windows platform (.NET Framework)
- **ModuleAPI_CE.dll** - For Windows CE platform

**Note:** This documentation package does NOT include the DLL files. You must obtain them separately from your SDK provider.

### 2. Namespaces
The SDK uses three main namespaces:
- `MODULETECH` - Base classes and Reader class
- `MODULETECH_GEN2` - Gen2 tag operation enumerations and classes
- `MODULELIBRARY` - Exception classes

## Integration Steps

### Step 1: Add Reference to Your Project

1. **In Visual Studio:**
   - Right-click on your project → **Add** → **Reference**
   - Click **Browse** and navigate to the location of `ModuleAPI.dll`
   - Select the DLL and click **OK**

2. **For .NET Core/.NET 5+:**
   - You may need to use `DllImport` or ensure the DLL is compatible
   - Place the DLL in your output directory

3. **Alternative (Manual Copy):**
   - Copy `ModuleAPI.dll` to your project's `bin` directory
   - Ensure it's included in your deployment

### Step 2: Add Using Statements

Add these using statements to your C# files:

```csharp
using MODULETECH;
using MODULETECH.Gen2;
using MODULELIBRARY;
```

### Step 3: Basic Usage Pattern

#### 1. Create Reader Instance

```csharp
try
{
    // For network connection (IP address)
    Reader rdr = Reader.Create("192.168.0.250", Region.NA, 4);
    
    // For serial connection (COM port)
    // Reader rdr = Reader.Create("COM1", Region.NA, 4);
}
catch (Exception ex)
{
    Console.WriteLine("Create failed: " + ex.ToString());
    return;
}
```

**Parameters:**
- `uriString`: IP address (e.g., "192.168.0.250") or COM port (e.g., "COM1")
- `region`: Frequency region (usually `Region.NA` for North America)
- `antsnum`: Number of physical antenna ports on the reader

#### 2. Configure Reader Parameters

```csharp
// Set read plan (which antennas to use)
int[] antennas = new int[] { 1, 2, 4 };
SimpleReadPlan readPlan = new SimpleReadPlan(antennas);
rdr.ParamSet("ReadPlan", readPlan);

// Set antenna power (optional)
AntPower antPower = new AntPower(1, 3000, 3000); // antenna 1, read power 30dBm, write power 30dBm
rdr.ParamSet("AntPower", antPower);
```

#### 3. Perform Operations

**Synchronous Inventory (Blocking):**
```csharp
// Read tags for 500 milliseconds
TagReadData[] tags = rdr.Read(500);

foreach (TagReadData tag in tags)
{
    Console.WriteLine($"EPC: {tag.EPCString}, Antenna: {tag.Antenna}, RSSI: {tag.Rssi}");
}
```

**Asynchronous Inventory (Event-based):**
```csharp
// Register event handlers
rdr.TagsRead += OnTagsRead;
rdr.ReadException += OnReadException;

// Configure asynchronous inventory
BackReadOption backReadOption = new BackReadOption();
backReadOption.ReadDuration = 1000;  // 1 second inventory cycle
backReadOption.ReadInterval = 100;    // 100ms idle interval
backReadOption.IsFastRead = false;
rdr.ParamSet("BackReadOption", backReadOption);

// Start asynchronous inventory
rdr.StartReading();

// ... your code continues ...

// Stop inventory when done
rdr.StopReading();
```

**Event Handlers:**
```csharp
private void OnTagsRead(object sender, TagsReadEventArgs e)
{
    foreach (TagReadData tag in e.Tags)
    {
        Console.WriteLine($"Tag found: {tag.EPCString}");
    }
}

private void OnReadException(object sender, ReadExceptionEventArgs e)
{
    Console.WriteLine($"Reader exception: {e.ReaderException.Message}");
}
```

**Read Tag Memory:**
```csharp
// Read 2 words from TID bank starting at address 2
ushort[] data = rdr.ReadTagMemWords(null, MemBank.TID, 2, 2);
string hexData = ByteFormat.ToHex(data);
Console.WriteLine($"Read data: {hexData}");
```

**Write Tag Memory:**
```csharp
// Write data to USER bank
string dataStr = "0x44445555";
ushort[] writeData = new ushort[2];
for (int i = 0; i < writeData.Length; ++i)
{
    writeData[i] = ushort.Parse(dataStr.Substring(i * 4 + 2, 4), 
        System.Globalization.NumberStyles.AllowHexSpecifier);
}
rdr.WriteTagMemWords(null, MemBank.USER, 3, writeData);
```

**Write EPC:**
```csharp
TagData tagData = new TagData("1234567890ABCDEF");
rdr.WriteTag(null, tagData);
```

#### 4. Disconnect

```csharp
rdr.Disconnect();
```

## Complete Example

```csharp
using System;
using MODULETECH;
using MODULETECH.Gen2;

class Program
{
    static Reader reader;

    static void Main(string[] args)
    {
        try
        {
            // Create reader instance
            reader = Reader.Create("192.168.0.250", Region.NA, 4);
            Console.WriteLine("Reader connected successfully");

            // Configure read plan
            int[] antennas = new int[] { 1, 2, 3, 4 };
            SimpleReadPlan readPlan = new SimpleReadPlan(antennas);
            reader.ParamSet("ReadPlan", readPlan);

            // Perform synchronous inventory
            Console.WriteLine("Starting inventory...");
            TagReadData[] tags = reader.Read(2000); // 2 seconds

            Console.WriteLine($"Found {tags.Length} tags:");
            foreach (TagReadData tag in tags)
            {
                Console.WriteLine($"  EPC: {tag.EPCString}, Antenna: {tag.Antenna}, RSSI: {tag.Rssi}");
            }

            // Disconnect
            reader.Disconnect();
            Console.WriteLine("Reader disconnected");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }
}
```

## Key Classes and Methods

### Reader Class
- `Create()` - Initialize reader instance
- `Disconnect()` - Release resources
- `Read()` - Synchronous inventory
- `StartReading()` / `StopReading()` - Asynchronous inventory
- `ReadTagMemWords()` - Read tag memory
- `WriteTagMemWords()` - Write tag memory
- `WriteTag()` - Write EPC
- `LockTag()` - Lock tag memory
- `KillTag()` - Kill tag
- `ParamSet()` / `ParamGet()` - Configure reader parameters

### Important Classes
- `SimpleReadPlan` - Specify antennas for inventory
- `TagReadData` - Tag inventory result
- `BackReadOption` - Asynchronous inventory configuration
- `AntPower` - Antenna power settings
- `ByteFormat` - Convert between hex strings and byte arrays
- `MemBank` - Memory bank enumeration (EPC, TID, USER, Reserved)

### Regions
Common region values:
- `Region.NA` - North America
- `Region.EU` - Europe
- `Region.PRC` - China (920-925 MHz)
- `Region.JP` - Japan

## Documentation

Open `index.html` in your web browser to view the complete API documentation with detailed examples for each method.

## Troubleshooting

1. **DLL Not Found:**
   - Ensure `ModuleAPI.dll` is in your output directory
   - Check that the DLL architecture (x86/x64) matches your project

2. **Connection Failed:**
   - Verify reader IP address and network connectivity
   - Check if reader is powered on
   - Ensure correct COM port for serial connections

3. **No Tags Found:**
   - Verify antenna connections
   - Check antenna power settings
   - Ensure tags are within read range
   - Verify ReadPlan is configured correctly

4. **Exceptions:**
   - Always wrap SDK calls in try-catch blocks
   - Check `ReadException` event for asynchronous operations
   - Review documentation for parameter requirements

## Next Steps

1. Obtain the `ModuleAPI.dll` file from your provider
2. Create a test project and add the DLL reference
3. Start with the basic example above
4. Explore the HTML documentation for advanced features
5. Integrate into your application

## Additional Resources

- See `html/` folder for detailed API documentation
- Each HTML file covers a specific topic (inventory, tag operations, parameters, etc.)
- Examples are provided in C# syntax throughout the documentation

