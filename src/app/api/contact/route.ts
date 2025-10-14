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

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'DEN BMX Contact Form <onboarding@resend.dev>', // You'll need to verify your domain
      to: ['hess.rylan@gmail.com'],
      replyTo: body.email,
      subject: `🏁 New Contact from ${body.name} - DEN BMX`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 30px; text-align: center;">
            <h1 style="color: #fbbf24; font-size: 32px; margin: 0; text-shadow: 2px 2px 0px #ec4899;">
              🏁 DEN BMX CONTACT FORM 🏁
            </h1>
          </div>
          
          <div style="background: #1e293b; padding: 30px; border: 4px solid #fbbf24;">
            <h2 style="color: #fbbf24; font-size: 24px; margin-top: 0;">New Message from ${body.name}</h2>
            
            <div style="background: #0f172a; border: 2px solid #22d3ee; padding: 20px; margin: 20px 0;">
              <p style="color: #22d3ee; font-weight: bold; margin: 0 0 10px 0;">FROM:</p>
              <p style="color: white; margin: 0;">${body.name}</p>
              <p style="color: white; margin: 5px 0 0 0;">${body.email}</p>
            </div>
            
            <div style="background: #0f172a; border: 2px solid #a3e635; padding: 20px; margin: 20px 0;">
              <p style="color: #a3e635; font-weight: bold; margin: 0 0 10px 0;">MESSAGE:</p>
              <p style="color: white; white-space: pre-wrap; line-height: 1.6; margin: 0;">${body.message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${body.email}" style="background: linear-gradient(135deg, #fb923c 0%, #dc2626 100%); color: white; padding: 15px 30px; text-decoration: none; font-weight: bold; border: 4px solid black; display: inline-block;">
                📧 REPLY TO ${body.name}
              </a>
            </div>
          </div>
          
          <div style="background: black; padding: 20px; text-align: center; border: 2px solid #fbbf24;">
            <p style="color: #fbbf24; font-weight: bold; margin: 0;">
              ⚡ DEN BMX ⚡ DENVER METRO BMX SCHEDULES ⚡
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

