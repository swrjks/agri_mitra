import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Leaf, AlertTriangle } from "lucide-react";
import { useState } from "react";

const CropHealthAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            AI-Powered
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Crop Analysis
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload crop images to get instant disease detection, yield predictions, and treatment recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <Card className="border-2 border-primary/20 shadow-medium">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Camera className="w-6 h-6 text-primary" />
                Upload Crop Image
              </CardTitle>
              <CardDescription>
                Take a clear photo of your crop leaves or upload from your device
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={selectedImage} 
                        alt="Uploaded crop" 
                        className="mx-auto max-w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-foreground font-medium">Drop your image here or click to upload</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports JPG, PNG files up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <Button 
                  variant="agricultural" 
                  className="w-full" 
                  disabled={!selectedImage}
                >
                  Analyze Crop Health
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6">Health Analysis Results</h3>
            
            {selectedImage ? (
              <div className="space-y-4">
                <Card className="border-l-4 border-l-accent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Leaf className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Crop Health: Good</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your crop appears healthy with good leaf color and structure
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-destructive">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Minor Nutrient Deficiency</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Slight yellowing detected - consider nitrogen supplementation
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">Recommendations</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Apply nitrogen-rich fertilizer (20-10-10 NPK)</li>
                      <li>• Monitor soil moisture levels</li>
                      <li>• Check again in 7-10 days</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">Yield Prediction</h4>
                    <p className="text-2xl font-bold text-accent">85% of Expected Yield</p>
                    <p className="text-sm text-muted-foreground">Based on current health conditions</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border border-border/50">
                <CardContent className="p-8 text-center">
                  <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload a crop image to see AI-powered analysis results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropHealthAnalysis;