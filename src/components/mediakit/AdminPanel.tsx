import { Settings, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaKit } from "./MediaKitContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const { data, updateData, sectionVisibility, toggleSection, isEditMode, setIsEditMode } = useMediaKit();
  const { toast } = useToast();
  const [localData, setLocalData] = useState(data);

  const handleSave = () => {
    updateData(localData);
    toast({
      title: "Changes Saved",
      description: "Media kit data has been updated successfully.",
    });
  };

  const sections = [
    { key: "hero" as const, label: "Hero Section" },
    { key: "platforms" as const, label: "Platform Cards" },
    { key: "growth" as const, label: "Growth Charts" },
    { key: "audience" as const, label: "Audience Profile" },
    { key: "topContent" as const, label: "Top Content" },
    { key: "partners" as const, label: "Partners" },
    { key: "benefits" as const, label: "Collaboration Benefits" },
    { key: "contact" as const, label: "Contact CTA" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Media Kit Settings</SheetTitle>
          <SheetDescription>
            Edit content and control section visibility
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Edit Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <Label className="font-semibold">Edit Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable inline editing
              </p>
            </div>
            <Switch
              checked={isEditMode}
              onCheckedChange={setIsEditMode}
            />
          </div>

          {/* Hero Section Data */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Hero Section Data</h3>
            
            <div className="space-y-2">
              <Label>Total Community Reach</Label>
              <Input
                type="number"
                value={localData.hero.totalReach}
                onChange={(e) => setLocalData({
                  ...localData,
                  hero: { ...localData.hero, totalReach: parseInt(e.target.value) || 0 }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Monthly Impressions</Label>
              <Input
                type="number"
                value={localData.hero.monthlyImpressions}
                onChange={(e) => setLocalData({
                  ...localData,
                  hero: { ...localData.hero, monthlyImpressions: parseInt(e.target.value) || 0 }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Newsletter Subscribers</Label>
              <Input
                type="number"
                value={localData.hero.newsletterSubscribers}
                onChange={(e) => setLocalData({
                  ...localData,
                  hero: { ...localData.hero, newsletterSubscribers: parseInt(e.target.value) || 0 }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>About Text</Label>
              <Textarea
                value={localData.hero.aboutText}
                onChange={(e) => setLocalData({
                  ...localData,
                  hero: { ...localData.hero, aboutText: e.target.value }
                })}
                rows={4}
              />
            </div>
          </div>

          {/* Section Visibility Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Section Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Toggle sections to show/hide before export or sharing
            </p>
            
            {sections.map((section) => (
              <div
                key={section.key}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {sectionVisibility[section.key] ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Label className="cursor-pointer">
                    {section.label}
                  </Label>
                </div>
                <Switch
                  checked={sectionVisibility[section.key]}
                  onCheckedChange={() => toggleSection(section.key)}
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>

          {/* Data Source Info */}
          <div className="p-4 bg-muted/50 border border-border rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Data Sources</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Facebook Group Analytics</p>
              <p>• Facebook Page Insights</p>
              <p>• Google Analytics (Blog)</p>
              <p>• Email Campaign Data</p>
            </div>
            <p className="text-xs text-muted-foreground italic mt-2">
              Manual overrides will persist until next data refresh
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminPanel;
