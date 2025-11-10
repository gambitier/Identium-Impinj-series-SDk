# How to Run ExampleProgram.cs

## Prerequisites

1. **.NET Framework SDK** (version 4.8 or later) or **Visual Studio**
2. **ModuleAPI.dll** - The SDK DLL file (found in `Identium_IPJSeries_LatestDemo_260425.zip` in the root directory)
3. **RFID Reader** - An Impinj RFID reader connected to your network (or COM port)

## Method 1: Using Visual Studio (Recommended)

### Step 1: Open the Project
1. Open Visual Studio
2. Go to **File** → **Open** → **Project/Solution**
3. Navigate to this folder and select `ImpinjReaderExample.csproj`

### Step 2: Add ModuleAPI.dll Reference
1. Right-click on **References** in Solution Explorer
2. Select **Add Reference**
3. Click **Browse** button
4. Navigate to where you placed `ModuleAPI.dll` and select it
5. Click **OK**

**OR** if you placed `ModuleAPI.dll` in the same folder as the `.csproj` file, the reference should already be configured.

### Step 3: Configure Reader Settings
Open `ExampleProgram.cs` and update these lines (around line 17-19):
```csharp
string readerIP = "192.168.0.250";  // Change to your reader's IP address
Region region = Region.NA;          // Change to your region (NA, EU, PRC, etc.)
int antennaCount = 4;               // Change to your reader's antenna count
```

### Step 4: Run the Program
1. Press **F5** or click the **Start** button
2. The program will connect to the reader and perform various operations

## Method 2: Using Command Line (.NET SDK)

### Step 1: Install .NET SDK
If you don't have it, download from: https://dotnet.microsoft.com/download

### Step 2: Place ModuleAPI.dll
Copy `ModuleAPI.dll` to the same directory as `ExampleProgram.cs` and `ImpinjReaderExample.csproj`

### Step 3: Configure Reader Settings
Edit `ExampleProgram.cs` and update the reader IP, region, and antenna count.

### Step 4: Build and Run
Open a terminal/command prompt in this directory and run:

```bash
# Build the project
dotnet build

# Run the program
dotnet run
```

**OR** if using MSBuild directly:
```bash
# Build
msbuild ImpinjReaderExample.csproj

# Run
.\bin\Debug\net48\ImpinjReaderExample.exe
```

## Method 3: Using Visual Studio Code

### Step 1: Install Extensions
- Install **C#** extension by Microsoft
- Install **.NET Extension Pack** (optional but recommended)

### Step 2: Open Folder
1. Open VS Code
2. Go to **File** → **Open Folder**
3. Select this directory

### Step 3: Add ModuleAPI.dll
Place `ModuleAPI.dll` in this directory and ensure it's referenced in the `.csproj` file.

### Step 4: Configure and Run
1. Update reader settings in `ExampleProgram.cs`
2. Press **F5** or go to **Run** → **Start Debugging**
3. Select **.NET Core** or **.NET Framework** when prompted

## Troubleshooting

### Error: "Could not load file or assembly 'ModuleAPI.dll'"
- **Solution**: Ensure `ModuleAPI.dll` is in the same directory as your executable, or update the reference path in `.csproj`

### Error: "The type or namespace name 'MODULETECH' could not be found"
- **Solution**: The DLL reference is missing. Add it via Visual Studio's Add Reference dialog, or ensure the HintPath in `.csproj` is correct.

### Error: "Connection failed" or "Create failed"
- **Solution**: 
  - Check that your RFID reader is powered on and connected
  - Verify the IP address is correct (ping it: `ping 192.168.0.250`)
  - Check firewall settings
  - For COM port: Ensure the port exists and isn't in use

### Error: "No tags found"
- **Solution**: This is normal if no RFID tags are in range. Place tags near the reader antennas.

### Error: Target Framework Issues
- If `.NET Framework 4.8` is not available, you can change the TargetFramework in `.csproj`:
  - `net472` for .NET Framework 4.7.2
  - `net462` for .NET Framework 4.6.2
  - `netcoreapp3.1` or `net6.0` if the DLL supports .NET Core (check with your provider)

## Quick Test Without Reader

If you want to test compilation without a reader, you can comment out the reader operations temporarily:

```csharp
// Comment out the Reader.Create line temporarily
// reader = Reader.Create(readerIP, region, antennaCount);
```

This will let you verify the project compiles correctly, though it will fail at runtime when trying to use the reader.

## Expected Output

When running successfully, you should see:
```
Impinj RFID Reader Example
==========================

Connecting to reader at 192.168.0.250...
✓ Reader connected successfully
✓ ReadPlan configured

--- Synchronous Inventory Example ---
Starting synchronous inventory (2 seconds)...
Found X tag(s):
  EPC: [tag EPC code]
    Antenna: 1, RSSI: -45, Read Count: 1

--- Asynchronous Inventory Example ---
Starting asynchronous inventory (5 seconds)...
  [Event] Tag: [tag EPC code], Antenna: 1
Asynchronous inventory stopped

--- Tag Operations Example ---
Finding a tag...
Working with tag: [tag EPC code]
...
```

## Next Steps

- Modify the code to suit your needs
- Explore the HTML documentation for more API features
- Integrate into your own application

