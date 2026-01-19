import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  HelpCircle,
  Sun,
  Moon,
  X,
  Upload,
  Image,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SignatureData {
  name: string;
  title: string;
  company: string;
  website: string;
  phone: string;
  linkedin: string;
  evaluationLink: string;
  logoUrl: string;
}

function formatSwissPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("41") && digits.length >= 11) {
    const rest = digits.slice(2);
    return `+41 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7, 9)}`;
  }
  if (digits.startsWith("0") && digits.length >= 10) {
    const rest = digits.slice(1);
    return `+41 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7, 9)}`;
  }
  return phone;
}

const DEFAULT_LOGO = "https://placehold.co/120x40/d97706/ffffff?text=LOGO";

function generateSignatureHTML(data: SignatureData, isDark: boolean): string {
  const {
    name,
    title,
    company,
    website,
    phone,
    linkedin,
    evaluationLink,
    logoUrl,
  } = data;

  const bgColor = isDark ? "#1a1612" : "#ffffff";
  const nameColor = isDark ? "#f5f0eb" : "#1a1612";
  const mutedColor = isDark ? "#8a8078" : "#6b6560";
  const linkColor = isDark ? "#d97706" : "#c2410c";

  const hasPhone = phone.trim() !== "";
  const hasLinkedin = linkedin.trim() !== "";
  const hasWebsite = website.trim() !== "";
  const hasEvaluationLink = evaluationLink.trim() !== "";
  const formattedPhone = formatSwissPhone(phone.trim());

  const linkedinUrl = linkedin.trim().startsWith("http")
    ? linkedin.trim()
    : `https://linkedin.com/in/${linkedin.trim().replace(/^@/, "")}`;
  const companyName = company.trim() || "Ihre Firma";
  const displayLogo = logoUrl || DEFAULT_LOGO;
  const websiteUrl = website.trim().startsWith("http")
    ? website.trim()
    : `https://${website.trim()}`;
  const evalUrl = evaluationLink.trim().startsWith("http")
    ? evaluationLink.trim()
    : `https://${evaluationLink.trim()}`;

  const logoHtml = hasWebsite
    ? `<a href="${websiteUrl}" target="_blank" style="text-decoration: none;"><img src="${displayLogo}" alt="${companyName}" width="120" style="display: block; border: 0; margin-bottom: 12px; max-width: 120px;" /></a>`
    : `<img src="${displayLogo}" alt="${companyName}" width="120" style="display: block; border: 0; margin-bottom: 12px; max-width: 120px;" />`;

  const contactParts: string[] = [];
  if (hasPhone) contactParts.push(`<span>${formattedPhone}</span>`);
  if (hasLinkedin)
    contactParts.push(
      `<a href="${linkedinUrl}" target="_blank" style="color: ${linkColor}; text-decoration: none;">LinkedIn</a>`,
    );

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; background-color: ${bgColor};">
  <tr>
    <td style="padding: 16px 0;">
      ${logoHtml}
      <div style="font-weight: 600; font-size: 16px; color: ${nameColor}; margin-bottom: 2px;">${name || "Ihr Name"}</div>
      <div style="color: ${mutedColor}; margin-bottom: 8px;">${title || "Position"} bei ${companyName}</div>
      ${contactParts.length > 0 ? `<div style="color: ${mutedColor}; margin-bottom: 4px;">${contactParts.join(" &bull; ")}</div>` : ""}
      ${hasEvaluationLink ? `<div><a href="${evalUrl}" target="_blank" style="color: ${linkColor}; text-decoration: none;">Ihre Immobilie bewerten</a></div>` : ""}
    </td>
  </tr>
</table>`;
}

function SignaturePreview({
  data,
  isDark,
}: {
  data: SignatureData;
  isDark: boolean;
}) {
  const {
    name,
    title,
    company,
    website,
    phone,
    linkedin,
    evaluationLink,
    logoUrl,
  } = data;
  const hasPhone = phone.trim() !== "";
  const hasLinkedin = linkedin.trim() !== "";
  const hasWebsite = website.trim() !== "";
  const hasEvaluationLink = evaluationLink.trim() !== "";
  const formattedPhone = formatSwissPhone(phone.trim());
  const linkedinUrl = linkedin.trim().startsWith("http")
    ? linkedin.trim()
    : `https://linkedin.com/in/${linkedin.trim().replace(/^@/, "")}`;
  const companyName = company.trim() || "Ihre Firma";
  const displayLogo = logoUrl || DEFAULT_LOGO;
  const websiteUrl = website.trim().startsWith("http")
    ? website.trim()
    : `https://${website.trim()}`;
  const evalUrl = evaluationLink.trim().startsWith("http")
    ? evaluationLink.trim()
    : `https://${evaluationLink.trim()}`;

  const logoElement = (
    <img
      src={displayLogo}
      alt={companyName}
      width={120}
      className="block mb-3 object-contain"
      style={{ maxWidth: 120 }}
    />
  );

  return (
    <div className={`p-6 rounded-md ${isDark ? "bg-[#1a1612]" : "bg-white"}`}>
      {hasWebsite ? (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {logoElement}
        </a>
      ) : (
        logoElement
      )}
      <div
        className={`font-semibold text-base mb-0.5 ${isDark ? "text-[#f5f0eb]" : "text-[#1a1612]"}`}
      >
        {name || "Ihr Name"}
      </div>
      <div className={`mb-2 ${isDark ? "text-[#8a8078]" : "text-[#6b6560]"}`}>
        {title || "Position"} bei {companyName}
      </div>
      {(hasPhone || hasLinkedin) && (
        <div className={`mb-1 ${isDark ? "text-[#8a8078]" : "text-[#6b6560]"}`}>
          {hasPhone && <span>{formattedPhone}</span>}
          {hasPhone && hasLinkedin && <span className="mx-1">&bull;</span>}
          {hasLinkedin && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`no-underline ${isDark ? "text-[#d97706]" : "text-[#c2410c]"}`}
            >
              LinkedIn
            </a>
          )}
        </div>
      )}
      {hasEvaluationLink && (
        <div>
          <a
            href={evalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`no-underline ${isDark ? "text-[#d97706]" : "text-[#c2410c]"}`}
          >
            Ihre Immobilie bewerten
          </a>
        </div>
      )}
    </div>
  );
}

function InputWithClear({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10 h-11 rounded-lg"
        data-testid={`input-${id}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-60 hover:opacity-100 transition-opacity"
          data-testid={`button-clear-${id}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function LogoUpload({
  logoUrl,
  onLogoChange,
}: {
  logoUrl: string;
  onLogoChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte wählen Sie eine Bilddatei aus",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Die Datei darf maximal 2MB groß sein",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onLogoChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>Firmenlogo</Label>
      <div className="flex items-center gap-3">
        <div className="relative w-24 h-10 rounded-md border border-input bg-background flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <Image className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
            data-testid="button-upload-logo"
          >
            <Upload className="w-4 h-4" />
            Hochladen
          </Button>
          {logoUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              data-testid="button-remove-logo"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          data-testid="input-logo-file"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        PNG, JPG oder SVG, max. 2MB
      </p>
    </div>
  );
}

function ImportModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          data-testid="button-how-to-import"
        >
          <HelpCircle className="w-4 h-4" />
          Wie importieren?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Signatur importieren</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="gmail" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gmail" data-testid="tab-gmail">
              Gmail
            </TabsTrigger>
            <TabsTrigger value="macos" data-testid="tab-macos">
              macOS Mail
            </TabsTrigger>
            <TabsTrigger value="ios" data-testid="tab-ios">
              iOS Mail
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gmail" className="mt-4 space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Klicken Sie auf "Signatur kopieren"</li>
              <li>
                Öffnen Sie Gmail und gehen Sie zu Einstellungen (Zahnrad-Symbol)
              </li>
              <li>Klicken Sie auf "Alle Einstellungen anzeigen"</li>
              <li>Scrollen Sie zu "Signatur"</li>
              <li>Klicken Sie auf "Neu erstellen" und benennen Sie diese</li>
              <li>Fügen Sie Ihre Signatur ein (Strg/Cmd + V)</li>
              <li>
                Scrollen Sie nach unten und klicken Sie auf "Änderungen
                speichern"
              </li>
            </ol>
          </TabsContent>
          <TabsContent value="macos" className="mt-4 space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Klicken Sie auf "Signatur kopieren"</li>
              <li>Öffnen Sie Mail und gehen Sie zu Mail {">"} Einstellungen</li>
              <li>Klicken Sie auf den Reiter "Signaturen"</li>
              <li>Klicken Sie auf +, um eine neue Signatur zu erstellen</li>
              <li>Benennen Sie Ihre Signatur</li>
              <li>Fügen Sie die Signatur im Vorschaubereich ein</li>
              <li>Ziehen Sie die Signatur zu Ihrem E-Mail-Konto</li>
            </ol>
          </TabsContent>
          <TabsContent value="ios" className="mt-4 space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Klicken Sie auf "Signatur kopieren"</li>
              <li>
                Öffnen Sie Einstellungen {">"} Mail {">"} Signatur
              </li>
              <li>Wählen Sie Ihr E-Mail-Konto aus</li>
              <li>Tippen Sie in das Signaturfeld</li>
              <li>Fügen Sie Ihre Signatur ein</li>
              <li>Gehen Sie zurück, um automatisch zu speichern</li>
            </ol>
            <p className="text-xs text-muted-foreground/70 mt-4">
              Hinweis: iOS kann einige Formatierungen vereinfachen. Für beste
              Ergebnisse senden Sie sich die Signatur zuerst per E-Mail an Ihren
              Desktop.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const [data, setData] = useState<SignatureData>({
    name: "",
    title: "",
    company: "",
    website: "",
    phone: "",
    linkedin: "",
    evaluationLink: "",
    logoUrl: "",
  });
  const [previewDark, setPreviewDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updateField = (field: keyof SignatureData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = async () => {
    const html = generateSignatureHTML(data, previewDark);
    try {
      const htmlBlob = new Blob([html], { type: "text/html" });
      const textBlob = new Blob([html], { type: "text/plain" });
      const clipboardItem = new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob,
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      toast({
        title: "Kopiert!",
        description: "Signatur wurde kopiert - jetzt in Gmail einfügen",
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Kopieren fehlgeschlagen",
        description:
          "Bitte versuchen Sie es erneut oder wählen Sie den Text manuell aus",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            E-Mail-Signatur Generator für Immobilienmakler
          </h1>
          <p className="text-muted-foreground">
            Erstellen Sie in Sekunden eine professionelle E-Mail-Signatur
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="space-y-6">
            <LogoUpload
              logoUrl={data.logoUrl}
              onLogoChange={(url) => updateField("logoUrl", url)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Vollständiger Name</Label>
                <InputWithClear
                  id="name"
                  value={data.name}
                  onChange={(v) => updateField("name", v)}
                  placeholder="Max Mustermann"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Position</Label>
                <InputWithClear
                  id="title"
                  value={data.title}
                  onChange={(v) => updateField("title", v)}
                  placeholder="Produktdesigner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Firma</Label>
                <InputWithClear
                  id="company"
                  value={data.company}
                  onChange={(v) => updateField("company", v)}
                  placeholder="Musterfirma GmbH"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Webseite</Label>
                <InputWithClear
                  id="website"
                  value={data.website}
                  onChange={(v) => updateField("website", v)}
                  placeholder="www.musterfirma.de"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <InputWithClear
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(v) => updateField("phone", v)}
                  placeholder="+41 44 123 45 67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <InputWithClear
                  id="linkedin"
                  value={data.linkedin}
                  onChange={(v) => updateField("linkedin", v)}
                  placeholder="benutzername oder URL"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="evaluationLink">
                  Link "Ihre Immobilie bewerten"
                </Label>
                <InputWithClear
                  id="evaluationLink"
                  value={data.evaluationLink}
                  onChange={(v) => updateField("evaluationLink", v)}
                  placeholder="www.beispiel.ch/bewertung"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">
                  Live-Vorschau
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewDark(!previewDark)}
                  className="gap-2"
                  data-testid="button-toggle-preview-mode"
                >
                  {previewDark ? (
                    <>
                      <Moon className="w-4 h-4" />
                      <span className="hidden sm:inline">Dunkel</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      <span className="hidden sm:inline">Hell</span>
                    </>
                  )}
                </Button>
              </div>
              <div
                className={`rounded-lg border border-border overflow-hidden ${previewDark ? "bg-[#1a1612]" : "bg-white"}`}
              >
                <SignaturePreview data={data} isDark={previewDark} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleCopy}
                className="flex-1 gap-2"
                data-testid="button-copy-html"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Signatur kopieren
                  </>
                )}
              </Button>
              <ImportModal />
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Fügen Sie die Signatur in die Signatur-Einstellungen Ihres
          E-Mail-Programms ein
        </p>
      </motion.div>
    </div>
  );
}
