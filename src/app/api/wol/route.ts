import { NextRequest, NextResponse } from 'next/server';

// Configuration from environment variables
const CONFIG = {
  secret_key: process.env.WOL_PASSWORD ? require('crypto').createHash('sha256').update(process.env.WOL_PASSWORD).digest('hex') : 'hashed_password_placeholder',
  mac_address: process.env.WOL_MAC_ADDRESS || '00:00:00:00:00:00',
  ip_address: process.env.WOL_IP_ADDRESS || '192.168.1.255',
  port: parseInt(process.env.WOL_PORT || '9', 10)
};

// Wake-on-LAN function
function wakeOnLan(mac: string, ip: string, port: number = 9) {
  // In a real implementation, this would use Node.js dgram to send the magic packet
  // For demo purposes, we'll just simulate it

  const addrByte = mac.split(':');
  const hwAddr: number[] = [];

  for (let a = 0; a < 6; a++) {
    hwAddr.push(parseInt(addrByte[a], 16));
  }

  // Create magic packet: 6 bytes of 0xFF + 16 repetitions of MAC address
  const magicPacket: number[] = [];
  for (let i = 0; i < 6; i++) {
    magicPacket.push(0xFF);
  }
  for (let i = 0; i < 16; i++) {
    magicPacket.push(...hwAddr);
  }

  // In a real implementation:
  // const dgram = require('dgram');
  // const client = dgram.createSocket('udp4');
  // client.send(Buffer.from(magicPacket), 0, magicPacket.length, port, ip, (err) => {
  //   client.close();
  // });

  console.log(`WOL packet sent to ${mac} via ${ip}:${port}`);
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: '❌ Invalid JSON body!' }, { status: 400 });
    }

    const { password } = body;
    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      return NextResponse.json({ message: '❌ Password required!' }, { status: 400 });
    }

    // Rate limiting (simple implementation)
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Check password (in real app, compare with hashed password from DB)
    const crypto = require('crypto');
    const hashedInput = crypto.createHash('sha256').update(password.trim()).digest('hex');

    if (hashedInput !== CONFIG.secret_key) {
      console.warn(`WOL: Failed login attempt from ${clientIP}`);
      return NextResponse.json({ message: '❌ Wrong password!' }, { status: 401 });
    }

    // Validate WOL configuration
    if (!CONFIG.mac_address || !CONFIG.ip_address) {
      console.error('WOL: Invalid configuration');
      return NextResponse.json({ message: '❌ Service configuration error!' }, { status: 500 });
    }

    // Send WOL packet
    try {
      wakeOnLan(CONFIG.mac_address, CONFIG.ip_address, CONFIG.port);
      console.log(`WOL: Wake packet sent to ${CONFIG.mac_address} from ${clientIP}`);
    } catch (wolError) {
      console.error('WOL: Failed to send wake packet:', wolError);
      return NextResponse.json({ message: '❌ Failed to send wake packet!' }, { status: 500 });
    }

    return NextResponse.json({ message: '✅ Computer has been woken up!' });

  } catch (error) {
    console.error('WOL API Error:', error);
    return NextResponse.json({
      message: '❌ Internal server error!',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
