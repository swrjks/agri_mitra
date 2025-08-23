import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, MapPin, Calendar, Loader2, Target, BarChart3 } from "lucide-react";
import { useState } from "react";
import IndiaMap from "@/components/IndiaMap";
import { fetchNearbyMarketPrices, generatePricePrediction, fetchAllMandiPrices, type MarketPrice, type PricePrediction } from "@/services/priceService";

const mockPriceData = [
  { crop: "Wheat", currentPrice: "₹2,150", change: "+5.2%", location: "Punjab" },
  { crop: "Rice", currentPrice: "₹3,420", change: "-2.1%", location: "Haryana" },
  { crop: "Cotton", currentPrice: "₹5,680", change: "+8.7%", location: "Gujarat" },
  { crop: "Sugarcane", currentPrice: "₹350", change: "+3.4%", location: "Maharashtra" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry", "Jammu and Kashmir", "Ladakh"
];

const CropPriceSection = () => {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [location, setLocation] = useState("");
  const [mandiLocation, setMandiLocation] = useState("");
  const [nearbyMarkets, setNearbyMarkets] = useState<MarketPrice[]>([]);
  const [allMandiPrices, setAllMandiPrices] = useState<MarketPrice[]>([]);
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [mandiLoading, setMandiLoading] = useState(false);

  const handleGetNearbyMarkets = async () => {
    if (!selectedCrop || !location) return;
    
    setLoading(true);
    try {
      const markets = await fetchNearbyMarketPrices(selectedCrop, location);
      setNearbyMarkets(markets);
    } catch (error) {
      console.error('Error fetching nearby markets:', error);
    }
    setLoading(false);
  };

  const handleGetPrediction = async () => {
    if (!selectedCrop || !location) return;
    
    setPredictionLoading(true);
    try {
      const predictionResult = await generatePricePrediction(selectedCrop, location, selectedPeriod);
      setPrediction(predictionResult);
    } catch (error) {
      console.error('Error generating prediction:', error);
    }
    setPredictionLoading(false);
  };

  const handleGetMandiPrices = async () => {
    if (!mandiLocation) return;
    
    setMandiLoading(true);
    try {
      const mandiPrices = await fetchAllMandiPrices(mandiLocation);
      setAllMandiPrices(mandiPrices);
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
    }
    setMandiLoading(false);
  };

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real-time
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Crop Prices
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get accurate, up-to-date market prices from mandis across India with AI-powered predictions
          </p>
        </div>

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 items-start">
          {/* Price Prediction Form */}
          <Card className="border-2 border-primary/20 shadow-medium">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                Price Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Select Crop
                  </label>
                  <select 
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="cotton">Cotton</option>
                    <option value="sugarcane">Sugarcane</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Select State
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <SelectValue placeholder="Choose your state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Prediction Period
                  </label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="current">Current Price</option>
                    <option value="7 days">Next 7 days</option>
                    <option value="15 days">Next 15 days</option>
                    <option value="30 days">Next 30 days</option>
                  </select>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button 
                    onClick={handleGetNearbyMarkets}
                    disabled={!selectedCrop || !location || loading}
                    className="flex-1"
                    variant="outline"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    Nearby Markets
                  </Button>
                  <Button 
                    onClick={handleGetPrediction}
                    disabled={!selectedCrop || !location || predictionLoading}
                    variant="agricultural" 
                    className="flex-1"
                  >
                    {predictionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                    Predict Price
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* India Map */}
          <div className="xl:col-span-1 lg:col-span-2">
            <IndiaMap selectedCrop={selectedCrop} selectedPeriod={selectedPeriod} />
          </div>

          {/* Market Prices & Predictions */}
          <div className="space-y-6">
            {/* Nearby Markets */}
            {nearbyMarkets.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Nearby Markets
                </h3>
                <div className="space-y-3">
                  {nearbyMarkets.slice(0, 5).map((market, index) => (
                    <Card key={index} className="border border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-foreground">{market.market}</h4>
                            <p className="text-sm text-muted-foreground">{market.commodity}</p>
                            <p className="text-xs text-muted-foreground">{market.arrival_date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">₹{Math.round(parseFloat(market.modal_price))}</p>
                            <p className="text-sm text-muted-foreground">
                              ₹{Math.round(parseFloat(market.min_price))} - ₹{Math.round(parseFloat(market.max_price))}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Price Prediction Results */}
            {prediction && (
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  {prediction.period === 'Current' ? 'Current Price' : 'Price Prediction'}
                </h3>
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-foreground capitalize">{prediction.crop}</h4>
                          <p className="text-muted-foreground">{prediction.location} • {prediction.period}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-primary">{prediction.predictedPrice}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              prediction.trend === 'up' ? 'bg-accent/10 text-accent' :
                              prediction.trend === 'down' ? 'bg-destructive/10 text-destructive' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {prediction.trend === 'up' ? '↗ Rising' : 
                               prediction.trend === 'down' ? '↘ Falling' : '→ Stable'}
                            </span>
                            <span className="text-sm text-muted-foreground">{prediction.confidence} confidence</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Key Factors:</h5>
                        <div className="flex flex-wrap gap-2">
                          {prediction.factors.slice(0, 3).map((factor, index) => (
                            <span key={index} className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Default Market Prices */}
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {selectedPeriod === "current" ? "Current Rates" : selectedPeriod === "7 days" ? "7 days prediction" : selectedPeriod === "15 days" ? "15 days prediction" : "30 days prediction"}
                </h3>
                <div className="flex gap-2 items-center">
                  <Select value={mandiLocation} onValueChange={setMandiLocation}>
                    <SelectTrigger className="w-48 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleGetMandiPrices}
                    disabled={!mandiLocation || mandiLoading}
                    variant="outline"
                    size="sm"
                  >
                    {mandiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Prices"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {(allMandiPrices.length > 0 ? allMandiPrices : mockPriceData.map(price => ({
                  market: `${price.location} Market`,
                  commodity: price.crop,
                  state: price.location,
                  district: price.location,
                  price: price.currentPrice.replace('₹', '').replace(',', ''),
                  arrival_date: new Date().toISOString().split('T')[0],
                  min_price: (parseInt(price.currentPrice.replace('₹', '').replace(',', '')) - 200).toString(),
                  max_price: (parseInt(price.currentPrice.replace('₹', '').replace(',', '')) + 300).toString(),
                  modal_price: price.currentPrice.replace('₹', '').replace(',', '')
                }))).slice(0, 8).map((price, index) => (
                  <Card key={index} className="border border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">{price.commodity}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {price.market}
                          </p>
                          <p className="text-xs text-muted-foreground">{price.arrival_date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-foreground">
                            ₹{Math.round(parseFloat(price.modal_price) || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ₹{Math.round(parseFloat(price.min_price) || 0)} - ₹{Math.round(parseFloat(price.max_price) || 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {allMandiPrices.length > 8 && (
                <Button variant="outline" className="w-full mt-4">
                  View All {allMandiPrices.length} Commodities
                </Button>
              )}
              
              {allMandiPrices.length === 0 && !mandiLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Enter a location above to see live mandi prices for all commodities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropPriceSection;