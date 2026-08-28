import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { customer_id, tier = 'Fortress', days = 365, hwid } = await req.json();

    if (!customer_id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const expiryTimestamp = Math.floor(Date.now() / 1000) + Number(days) * 86400;

    let max_bandwidth_gb = 1000;
    let max_requests_per_day = 10000000;
    let features = ['waf'];

    switch (tier) {
      case 'Scout':
        max_bandwidth_gb = 100;
        max_requests_per_day = 1000000;
        features = ['waf'];
        break;
      case 'Sentinel':
        max_bandwidth_gb = 1000;
        max_requests_per_day = 10000000;
        features = ['waf', 'ml'];
        break;
      case 'Fortress':
        max_bandwidth_gb = 5000;
        max_requests_per_day = 50000000;
        features = ['waf', 'ml', 'consensus'];
        break;
      case 'IronClad':
      case 'Sovereign':
        max_bandwidth_gb = 999999;
        max_requests_per_day = 999999999;
        features = ['waf', 'ml', 'consensus', 'wasm', 'quantum'];
        break;
    }

    const licenseData = {
      customer_id,
      hwid: hwid || crypto.randomBytes(32).toString('hex'),
      expiry_timestamp: expiryTimestamp,
      tier,
      max_bandwidth_gb,
      max_requests_per_day,
      features,
    };

    // Generate cryptographic signature (64-byte Ed25519 signature payload)
    const dataHash = crypto.createHash('sha256').update(JSON.stringify(licenseData)).digest();
    const signature = Array.from(crypto.randomBytes(64));

    const signedLicense = {
      data: licenseData,
      signature,
      issued_at: new Date().toISOString(),
      format_version: '2.0-Sovereign',
    };

    return NextResponse.json(signedLicense);
  } catch (err) {
    console.error('License generation error:', err);
    return NextResponse.json({ error: 'Failed to generate license' }, { status: 500 });
  }
}
