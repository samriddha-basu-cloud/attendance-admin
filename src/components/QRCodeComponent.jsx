import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const QRCodeComponent = () => {
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchQRCode = async () => {
    setLoading(true);
    const now = new Date();
    setLastUpdated(now);

    // Format date and time in IST
    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const [
      { value: day },,
      { value: month },,
      { value: year },,
      { value: hour },,
      { value: minute },,
      { value: second }
    ] = formatter.formatToParts(now);

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hour}:${minute}:${second}`;

    const qrContent = JSON.stringify({ date: formattedDate, time: formattedTime });

    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrContent)}&size=200x200`);
      if (response.ok) {
        const imageUrl = response.url;
        setQrCodeImage(imageUrl);
        setError(null);
      } else {
        setError("Failed to fetch QR code");
        console.error("Failed to fetch QR code");
      }
    } catch (error) {
      setError("Error connecting to QR service");
      console.error("Error fetching QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCode();
    const qrInterval = setInterval(fetchQRCode, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(qrInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Format the display times
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  // Calculate next refresh time
  const getNextRefreshTime = () => {
    if (!lastUpdated) return "Soon";
    const nextUpdate = new Date(lastUpdated.getTime() + 5 * 60 * 1000);
    return formatTime(nextUpdate);
  };

  return (
    <Card className="bg-black border-yellow-500 border-2 text-white shadow-lg shadow-yellow-500/20 w-full max-w-md mx-auto">
      <CardHeader className="border-b border-yellow-500/30">
        <CardTitle className="text-xl font-bold text-yellow-400 flex items-center justify-between">
          <span>Dynamic QR Code</span>
          <span className="text-sm font-normal text-gray-400 flex items-center gap-1">
            <Clock className="h-4 w-4 text-yellow-400" /> {formatTime(currentTime)}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-center pt-6 pb-2">
        {loading ? (
          <div className="h-52 w-52 flex items-center justify-center bg-gray-800 rounded-md animate-pulse">
            <RefreshCw className="h-8 w-8 text-yellow-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="h-52 w-52 flex items-center justify-center bg-gray-800 rounded-md border border-red-500/50">
            <p className="text-red-400 text-center px-4">{error}</p>
          </div>
        ) : (
          <div className="p-3 bg-white rounded-md">
            <img 
              src={qrCodeImage} 
              alt="QR Code" 
              width={200} 
              height={200} 
              className="rounded"
            />
          </div>
        )}
        
        <div className="w-full mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-gray-300">
            <Calendar className="h-4 w-4 text-yellow-400" />
            <span>{lastUpdated ? formatDate(lastUpdated) : "..."}</span>
          </div>
          <div className="flex items-center gap-1 justify-end text-gray-300">
            <RefreshCw className="h-4 w-4 text-yellow-400" />
            <span>Next: {getNextRefreshTime()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-yellow-500/30 pt-4">
        <Button 
          onClick={fetchQRCode} 
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" /> 
              Refresh QR Code
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeComponent;