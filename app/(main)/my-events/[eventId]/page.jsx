"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Eye,
  Loader2,
  MapPin,
  QrCode,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import QRScannerModal from "../_components/qr-scanner-modal";

export default function EventWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;

  const [activeTab, setActiveTab] = useState("attendees");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [requestSummary, setRequestSummary] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [heroBlurb, setHeroBlurb] = useState("");
  const [whyAttend, setWhyAttend] = useState("");
  const [agenda, setAgenda] = useState("");
  const [faqs, setFaqs] = useState("");
  const [resources, setResources] = useState("");
  const [attendeeNotes, setAttendeeNotes] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const { data: dashboardData, isLoading } = useConvexQuery(api.dashboard.getEventDashboard, { eventId });
  const { data: registrations, isLoading: loadingRegistrations } = useConvexQuery(api.registrations.getEventRegistrations, { eventId });
  const { data: changeRequests } = useConvexQuery(api.events.getEventChangeRequests, { eventId });
  const { mutate: submitChangeRequest, isLoading: isSubmitting } = useConvexMutation(api.events.submitEventChangeRequest);

  const filteredRegistrations = useMemo(() => {
    const list = registrations || [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;
    return list.filter((item) =>
      [item.attendeeName, item.attendeeEmail, item.qrCode].some((value) => value.toLowerCase().includes(query))
    );
  }, [registrations, searchQuery]);

  const handleSubmitRequest = async () => {
    if (!requestSummary.trim()) {
      toast.error("Add a short summary for the change request.");
      return;
    }

    try {
      await submitChangeRequest({
        eventId,
        requestType: "page_update",
        summary: requestSummary,
        aiPrompt: aiPrompt || undefined,
        proposedPayload: JSON.stringify({
          heroBlurb,
          whyAttend: whyAttend.split("\n").map((item) => item.trim()).filter(Boolean),
          agenda: agenda
            .split("\n")
            .map((line) => {
              const [time, title, description] = line.split("|").map((item) => item.trim());
              return { time, title, description: description || undefined };
            })
            .filter((item) => item.time && item.title),
          faqs: faqs
            .split("\n")
            .map((line) => {
              const [question, answer] = line.split("|").map((item) => item.trim());
              return { question, answer };
            })
            .filter((item) => item.question && item.answer),
          resources: resources
            .split("\n")
            .map((line) => {
              const [label, url] = line.split("|").map((item) => item.trim());
              return { label, url };
            })
            .filter((item) => item.label && item.url),
          attendeeNotes,
          contactEmail,
        }),
      });
      toast.success("Change request sent for authority approval.");
      setRequestSummary("");
      setAiPrompt("");
    } catch (error) {
      toast.error(error.message || "Could not submit request");
    }
  };

  if (isLoading || loadingRegistrations) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const { event, stats } = dashboardData;

  return (
    <div className="min-h-screen px-4 pb-20">
      <div className="mx-auto max-w-7xl space-y-6">
        <Button variant="ghost" onClick={() => router.push("/my-events")} className="-ml-2 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to My Events
        </Button>

        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.9))] p-6 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">{event.title}</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-200">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{format(event.startDate, "PPP p")}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.locationType === "online" ? "Online" : `${event.city}, ${event.state || event.country}`}</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4" />{stats.totalRegistrations} attendees</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-white/10 bg-white/10 text-white hover:bg-white/15" onClick={() => router.push(`/events/${event.slug}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Public Page
              </Button>
              {stats.isEventToday && !stats.isEventPast && (
                <Button className="bg-emerald-500 text-white hover:bg-emerald-400" onClick={() => setShowQRScanner(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Open Check-in Scanner
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Registrations", value: stats.totalRegistrations },
            { label: "Checked In", value: stats.checkedInCount },
            { label: "Check-in rate", value: `${stats.checkInRate}%` },
            { label: "Pending requests", value: (changeRequests || []).filter((item) => item.status === "pending").length },
          ].map((item) => (
            <Card key={item.label} className="py-0">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="content">AI Content Request</TabsTrigger>
            <TabsTrigger value="approvals">Approval Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="attendees" className="space-y-4">
            <div className="flex items-center gap-3">
              <Input placeholder="Search attendees by name, email, or QR code" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </div>
            <div className="space-y-3">
              {filteredRegistrations.map((registration) => (
                <Card key={registration._id} className="py-0">
                  <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">{registration.attendeeName}</p>
                      <p className="text-sm text-muted-foreground">{registration.attendeeEmail}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>{registration.qrCode}</span>
                      <span>{registration.checkedIn ? "Checked in" : "Pending check-in"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card className="py-0">
              <CardContent className="space-y-4 p-5">
                <div>
                  <p className="text-lg font-semibold">Prepare an AI-assisted page update</p>
                  <p className="text-sm text-muted-foreground">Event admins can propose content and logistics changes here. Authorities must approve before anything is applied to the public event page.</p>
                </div>
                <Input value={requestSummary} onChange={(event) => setRequestSummary(event.target.value)} placeholder="Summary of the requested change" />
                <Textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} rows={3} placeholder="Optional AI prompt that describes the intended page transformation" />
                <Textarea value={heroBlurb} onChange={(event) => setHeroBlurb(event.target.value)} rows={3} placeholder="Hero blurb" />
                <Textarea value={whyAttend} onChange={(event) => setWhyAttend(event.target.value)} rows={4} placeholder={"Why attend: one line per reason"} />
                <Textarea value={agenda} onChange={(event) => setAgenda(event.target.value)} rows={5} placeholder={"Agenda lines: time | title | description"} />
                <Textarea value={faqs} onChange={(event) => setFaqs(event.target.value)} rows={4} placeholder={"FAQ lines: question | answer"} />
                <Textarea value={resources} onChange={(event) => setResources(event.target.value)} rows={4} placeholder={"Resource lines: label | url"} />
                <Textarea value={attendeeNotes} onChange={(event) => setAttendeeNotes(event.target.value)} rows={3} placeholder="Attendee notes" />
                <Input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="Contact email for the event page" />
                <Button onClick={handleSubmitRequest} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Submit For Approval
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-3">
            {(changeRequests || []).map((request) => (
              <Card key={request._id} className="py-0">
                <CardContent className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{request.status}</span>
                    <span className="text-sm text-muted-foreground">{request.requestedByName}</span>
                  </div>
                  <p className="font-medium">{request.summary}</p>
                  {request.aiPrompt ? <p className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">{request.aiPrompt}</p> : null}
                  {request.status === "approved" ? (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Approved and applied
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {showQRScanner && <QRScannerModal isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} />}
    </div>
  );
}
