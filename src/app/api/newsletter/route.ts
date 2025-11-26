import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('newsletter_users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is fine
      console.error('Error checking existing user:', checkError);
      return NextResponse.json(
        { error: 'Failed to process subscription' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_users')
      .insert({
        email: email.toLowerCase().trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting newsletter subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        id: data.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

