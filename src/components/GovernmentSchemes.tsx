import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, MapPin } from "lucide-react";

const mockSchemes = [
  {
    name: "PM-KISAN Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to farmer families",
    eligibility: "All landholding farmers",
    amount: "₹6,000/year",
    status: "Active",
    deadline: "Ongoing",
    category: "Income Support"
  },
  {
    name: "Pradhan Mantri Crop Insurance Scheme",
    description: "Comprehensive crop insurance against natural calamities",
    eligibility: "All farmers including sharecroppers",
    amount: "Up to ₹2 lakh",
    status: "Active", 
    deadline: "Before sowing season",
    category: "Insurance"
  },
  {
    name: "Soil Health Card Scheme",
    description: "Free soil testing and nutrient recommendations",
    eligibility: "All farmers",
    amount: "Free service",
    status: "Active",
    deadline: "Ongoing",
    category: "Advisory"
  },
  {
    name: "Kisan Credit Card",
    description: "Easy agricultural credit access at subsidized interest rates",
    eligibility: "Landowner farmers",
    amount: "Based on land holding",
    status: "Active",
    deadline: "Ongoing", 
    category: "Credit"
  }
];

const GovernmentSchemes = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Government
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Schemes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover personalized scheme recommendations based on your profile, crops, and location
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Eligibility Checker */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-primary/20 shadow-medium sticky top-8">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Eligibility Checker
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Land Size (acres)
                  </label>
                  <Input placeholder="e.g. 2.5" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Primary Crop
                  </label>
                  <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Wheat</option>
                    <option>Rice</option>
                    <option>Cotton</option>
                    <option>Sugarcane</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    State
                  </label>
                  <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Punjab</option>
                    <option>Haryana</option>
                    <option>Gujarat</option>
                    <option>Maharashtra</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Farmer Type
                  </label>
                  <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Small & Marginal</option>
                    <option>Medium</option>
                    <option>Large</option>
                    <option>Sharecropper</option>
                  </select>
                </div>

                <Button variant="agricultural" className="w-full">
                  Check Eligibility
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Schemes List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Available Schemes for You</h3>
            
            <div className="space-y-4">
              {mockSchemes.map((scheme, index) => (
                <Card key={index} className="border border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg text-foreground">{scheme.name}</h4>
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                            {scheme.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{scheme.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Benefit Amount</p>
                        <p className="text-lg font-bold text-accent">{scheme.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Application Deadline</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {scheme.deadline}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-1">Eligibility</p>
                      <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="agricultural" size="sm">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GovernmentSchemes;