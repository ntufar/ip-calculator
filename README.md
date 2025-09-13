# IP Calculator

A modern, responsive IP calculator built with React, TypeScript, and Tailwind CSS. Calculate subnet information, network ranges, and host counts from IP addresses and CIDR notation.

## Features

- **IP Address Validation**: Validates IPv4 addresses and CIDR notation
- **Subnet Calculation**: Calculate network address, broadcast address, and host ranges
- **CIDR Support**: Full support for CIDR notation from /0 to /32
- **Network Class Detection**: Automatically detects network classes (A, B, C, D, E)
- **Host Counting**: Shows total and usable host counts
- **Wildcard Mask**: Displays wildcard mask for network configuration
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ip-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Usage

1. Enter an IP address with CIDR notation (e.g., `192.168.1.1/24`)
2. Or enter just an IP address (defaults to /24 subnet)
3. Click "Calculate" or press Enter
4. View the calculated network information

### Examples

- `192.168.1.1/24` - Class C network with 254 usable hosts
- `10.0.0.1/8` - Class A network with 16,777,214 usable hosts
- `172.16.0.1/16` - Class B network with 65,534 usable hosts
- `192.168.1.100` - Single IP (defaults to /24)

### Output Information

The calculator provides:

- **Network Information**:
  - IP Address
  - Subnet Mask
  - CIDR Notation
  - Network Class
  - Wildcard Mask

- **Address Range**:
  - Network Address
  - Broadcast Address
  - First Host
  - Last Host
  - Total Hosts
  - Usable Hosts

## Technical Details

### Built With

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **ESLint** - Code linting

### Key Functions

- `validateIP()` - Validates IPv4 address format
- `ipToNumber()` - Converts IP address to 32-bit number
- `numberToIP()` - Converts 32-bit number to IP address
- `getNetworkClass()` - Determines network class
- `calculateSubnet()` - Main calculation logic

### Algorithm

The calculator uses bitwise operations to:
1. Convert IP addresses to 32-bit integers
2. Calculate subnet masks from CIDR notation
3. Determine network and broadcast addresses
4. Calculate host ranges and counts

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── index.css        # Global styles with Tailwind
├── main.tsx         # Application entry point
└── assets/          # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with modern web technologies
- Inspired by network administration tools
- Designed for both beginners and professionals
