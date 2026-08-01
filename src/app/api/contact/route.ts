/**
 * Contact Form API Endpoint
 * 
 * POST /api/contact - Send contact form email
 */

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  source?: 'colorado' | 'denver';
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate input
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please email hess.rylan@gmail.com directly.' },
        { status: 500 }
      );
    }

    const isColorado = body.source === 'colorado';
    const brand = isColorado ? 'BMX Colorado' : 'DEN BMX';
    const brandColor = isColorado ? '#002868' : '#fbbf24';
    const accentColor = isColorado ? '#BF0A30' : '#22d3ee';

    const { data, error } = await resend.emails.send({
      from: isColorado
        ? 'BMX Colorado Contact <onboarding@resend.dev>'
        : 'DEN BMX Contact Form <onboarding@resend.dev>',
      to: ['hess.rylan@gmail.com'],
      replyTo: body.email,
      subject: `New Contact from ${body.name} — ${brand}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${isColorado ? '#002868' : 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'}; padding: 30px; text-align: center;">
            <h1 style="color: ${isColorado ? '#FFC72C' : brandColor}; font-size: 28px; margin: 0;">
              ${brand} Contact Form
            </h1>
          </div>

          <div style="background: ${isColorado ? '#F4F6F8' : '#1e293b'}; padding: 30px; border: 2px solid ${isColorado ? '#D0D7E2' : '#fbbf24'};">
            <h2 style="color: ${isColorado ? '#002868' : brandColor}; font-size: 22px; margin-top: 0;">New message from ${body.name}</h2>

            <div style="background: ${isColorado ? '#ffffff' : '#0f172a'}; border: 2px solid ${accentColor}; padding: 20px; margin: 20px 0;">
              <p style="color: ${accentColor}; font-weight: bold; margin: 0 0 10px 0;">FROM:</p>
              <p style="color: ${isColorado ? '#0B1C2D' : 'white'}; margin: 0;">${body.name}</p>
              <p style="color: ${isColorado ? '#0B1C2D' : 'white'}; margin: 5px 0 0 0;">${body.email}</p>
            </div>

            <div style="background: ${isColorado ? '#ffffff' : '#0f172a'}; border: 2px solid ${isColorado ? '#002868' : '#a3e635'}; padding: 20px; margin: 20px 0;">
              <p style="color: ${isColorado ? '#002868' : '#a3e635'}; font-weight: bold; margin: 0 0 10px 0;">MESSAGE:</p>
              <p style="color: ${isColorado ? '#0B1C2D' : 'white'}; white-space: pre-wrap; line-height: 1.6; margin: 0;">${body.message}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${body.email}" style="background: ${isColorado ? '#BF0A30' : 'linear-gradient(135deg, #fb923c 0%, #dc2626 100%)'}; color: white; padding: 15px 30px; text-decoration: none; font-weight: bold; display: inline-block; border-radius: 8px;">
                Reply to ${body.name}
              </a>
            </div>
          </div>

          <div style="background: ${isColorado ? '#002868' : 'black'}; padding: 20px; text-align: center;">
            <p style="color: ${isColorado ? '#FFC72C' : '#fbbf24'}; font-weight: bold; margin: 0;">
              ${isColorado ? 'BMX Colorado · Statewide community forum' : 'DEN BMX · Denver metro BMX schedules'}
            </p>
          </div>
        </div>
      `,
    });
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again or email directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      messageId: data?.id 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

