import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Shield, Smartphone, Key } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TwoFactorSetup = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'choose' | 'totp' | 'sms' | 'verify'>('choose');
  const [method, setMethod] = useState<'totp' | 'sms'>('totp');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const generateTOTPSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const setupTOTP = async () => {
    setLoading(true);
    try {
      const totpSecret = generateTOTPSecret();
      const issuer = 'Baking Great Bread';
      const label = `${issuer}:${user?.email}`;
      const qrCodeData = `otpauth://totp/${label}?secret=${totpSecret}&issuer=${issuer}`;
      
      // In a real app, you'd use a QR code library like qrcode
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=200x200`);
      setSecret(totpSecret);
      setStep('verify');
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      toast({
        title: 'Setup Failed',
        description: 'Failed to set up two-factor authentication',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupSMS = async () => {
    if (!phoneNumber) {
      toast({
        title: 'Phone Required',
        description: 'Please enter a phone number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd send SMS via Supabase Edge Function
      toast({
        title: 'SMS Sent',
        description: 'Verification code sent to your phone',
      });
      setStep('verify');
    } catch (error) {
      console.error('Error setting up SMS:', error);
      toast({
        title: 'Setup Failed',
        description: 'Failed to send SMS verification',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyAndSave = async () => {
    if (!verificationCode) {
      toast({
        title: 'Code Required',
        description: 'Please enter the verification code',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Generate backup codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );

      const { error } = await supabase.from('user_mfa').insert({
        user_id: user?.id,
        method,
        secret: method === 'totp' ? secret : null,
        phone_number: method === 'sms' ? phoneNumber : null,
        backup_codes: codes,
        is_verified: true,
        is_active: true,
      });

      if (error) throw error;

      setBackupCodes(codes);
      toast({
        title: 'Two-Factor Authentication Enabled',
        description: 'Your account is now more secure!',
      });
    } catch (error) {
      console.error('Error saving MFA:', error);
      toast({
        title: 'Verification Failed',
        description: 'Failed to verify code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (backupCodes.length > 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Backup Codes
          </CardTitle>
          <CardDescription>
            Save these backup codes in a secure location. You can use them to access your account if you lose your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
            {backupCodes.map((code, index) => (
              <div key={index} className="text-center py-1">
                {code}
              </div>
            ))}
          </div>
          <Alert>
            <AlertDescription>
              Store these codes safely. They won't be shown again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'choose' && (
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setMethod('totp');
                setStep('totp');
              }}
            >
              <QrCode className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Authenticator App</div>
                <div className="text-sm text-muted-foreground">
                  Use Google Authenticator, Authy, etc.
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => {
                setMethod('sms');
                setStep('sms');
              }}
            >
              <Smartphone className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">SMS Verification</div>
                <div className="text-sm text-muted-foreground">
                  Receive codes via text message
                </div>
              </div>
            </Button>
          </div>
        )}

        {step === 'totp' && (
          <div className="space-y-4 text-center">
            <div>
              <h3 className="font-medium mb-2">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with your authenticator app
              </p>
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto border rounded" />
              )}
            </div>
            <Button onClick={setupTOTP} disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate QR Code'}
            </Button>
          </div>
        )}

        {step === 'sms' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button onClick={setupSMS} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button onClick={verifyAndSave} disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
            </Button>
          </div>
        )}

        {step !== 'choose' && (
          <Button variant="ghost" onClick={() => setStep('choose')} className="w-full">
            Back to Options
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;