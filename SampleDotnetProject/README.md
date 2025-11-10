# Impinj RFID Reader SDK - Quick Start

## What is This Package?

This package contains **documentation** for the ModuleAPI C# SDK for Impinj RFID readers. It provides a complete API reference for integrating RFID reader functionality into your C# applications.

## Package Contents

- **`index.html`** - Main documentation entry point (open in web browser)
- **`html/`** - Detailed API documentation pages
- **`INTEGRATION_GUIDE.md`** - Step-by-step integration guide
- **`ExampleProgram.cs`** - Complete working example code

## Quick Start

### 1. Get the SDK DLL

**Important:** This package only contains documentation. You need to obtain the actual SDK DLL file (`ModuleAPI.dll`) from your provider.

### 2. Add Reference to Your Project

In Visual Studio:
1. Right-click your project → **Add** → **Reference**
2. Browse to `ModuleAPI.dll` and add it

### 3. Copy Example Code

See `ExampleProgram.cs` for a complete working example.

### 4. Basic Usage

```csharp
using MODULETECH;
using MODULETECH.Gen2;

// Create reader
Reader rdr = Reader.Create("192.168.0.250", Region.NA, 4);

// Configure antennas
int[] antennas = new int[] { 1, 2, 3, 4 };
SimpleReadPlan plan = new SimpleReadPlan(antennas);
rdr.ParamSet("ReadPlan", plan);

// Read tags
TagReadData[] tags = rdr.Read(2000);

// Disconnect
rdr.Disconnect();
```

## Documentation

- **Open `index.html`** in your web browser for the full API documentation
- See **`INTEGRATION_GUIDE.md`** for detailed integration instructions
- Check **`html/`** folder for specific topics:
  - `Reader_Life_Cycle.html` - Connecting/disconnecting
  - `Synchronous_Inventory.html` - Blocking inventory operations
  - `ASynchronous_Inventory.html` - Event-based inventory
  - `Read_Tag.html` - Reading tag memory
  - `Write_Tag.html` - Writing tag memory
  - `Set_Parameters.html` - Configuration
  - And more...

## Key Features

- ✅ Synchronous and asynchronous tag inventory
- ✅ Read/Write tag memory (EPC, TID, USER banks)
- ✅ Tag filtering and singulation
- ✅ Antenna power control
- ✅ GPIO (GPI/GPO) operations
- ✅ Tag locking and killing
- ✅ Reader parameter configuration

## Support

For SDK DLL files and technical support, contact your Impinj SDK provider.

## Next Steps

1. Read `INTEGRATION_GUIDE.md` for complete instructions
2. Open `index.html` to browse the API documentation
3. Use `ExampleProgram.cs` as a starting point for your project
4. Explore the `html/` folder for specific API topics

