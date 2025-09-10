import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Lock, Calendar, Shield, Smartphone } from 'lucide-react';
import { format } from 'date-fns';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { state, getTotalAmount } = useBooking();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with your payment gateway integration
      // const response = await fetch('/api/payment/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     amount: getTotalAmount(),
      //     userId: user?.id,
      //     bookingDetails: state,
      //     paymentMethod: paymentForm,
      //   }),
      // });

      // Mock payment processing - replace with actual payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });

      navigate('/qr-code');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or use a different payment method.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!state.selectedMovie || !state.selectedShowTime || state.selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Session Expired</h1>
          <p className="text-muted-foreground mb-6">Please start your booking again.</p>
          <Button onClick={() => navigate('/')} variant="default">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = getTotalAmount();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/summary')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Summary
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-foreground">Payment</h1>
              <p className="text-sm text-muted-foreground">Secure checkout</p>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                      className="flex items-center gap-2 h-12"
                    >
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('upi')}
                      className="flex items-center gap-2 h-12"
                    >
                      <Smartphone className="w-4 h-4" />
                      UPI
                    </Button>
                  </div>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        type="text"
                        placeholder="John Doe"
                        value={paymentForm.cardholderName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          placeholder="MM/YY"
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Form */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        type="text"
                        placeholder="yourname@paytm"
                        value={paymentForm.upiId}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, upiId: e.target.value }))}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter your UPI ID (e.g., name@paytm, name@googlepay, name@phonepe)
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Movie Details */}
              <div>
                <h3 className="font-semibold text-lg">{state.selectedMovie.title}</h3>
                <p className="text-muted-foreground">{state.selectedMovie.genre}</p>
              </div>

              <Separator />

              {/* Show Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{format(new Date(state.selectedShowTime!.date), 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{state.selectedShowTime!.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screen:</span>
                  <span>{state.selectedShowTime!.screenName}</span>
                </div>
              </div>

              <Separator />

              {/* Seat Details */}
              <div>
                <h4 className="font-medium mb-2">Selected Seats</h4>
                <div className="space-y-2">
                  {state.selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span>{seat.row}{seat.number} ({seat.type})</span>
                      <span>₹{seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* User Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile:</span>
                  <span>{user?.mobile}</span>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;