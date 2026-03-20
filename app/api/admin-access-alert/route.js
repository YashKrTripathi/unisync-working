import { NextResponse } from "next/server";

const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml({ name, roleLabel, attemptedPath }) {
  const safeName = escapeHtml(name || "there");
  const safeRole = escapeHtml(roleLabel || "student");
  const safePath = escapeHtml(attemptedPath || "/admin");

  return `
    <div style="margin:0;padding:32px;background:#0b0b0f;font-family:Inter,Segoe UI,Arial,sans-serif;color:#f8fafc;">
      <div style="max-width:620px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;background:linear-gradient(180deg,#12121a 0%,#0b0b10 100%);">
        <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);background:radial-gradient(circle at top left,rgba(249,115,22,0.22),transparent 36%),#12121a;">
          <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:rgba(249,115,22,0.14);border:1px solid rgba(249,115,22,0.28);color:#fdba74;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
            UniSync Staff Access
          </div>
          <h1 style="margin:18px 0 8px;font-size:28px;line-height:1.2;color:#ffffff;">Admin portal access was not granted</h1>
          <p style="margin:0;color:rgba(255,255,255,0.72);font-size:15px;line-height:1.7;">
            Hello ${safeName}, we noticed an attempt to open the staff administration area in UniSync.
          </p>
        </div>
        <div style="padding:28px 32px;">
          <p style="margin:0 0 16px;color:rgba(255,255,255,0.84);font-size:15px;line-height:1.7;">
            This section is reserved for verified staff members such as admins, superadmins, and event managers. Your current access level is recorded as <strong style="color:#ffffff;">${safeRole}</strong>.
          </p>
          <div style="margin:20px 0;padding:18px 20px;border-radius:18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
            <div style="color:#94a3b8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;">Attempted Route</div>
            <div style="color:#ffffff;font-size:15px;font-weight:600;">${safePath}</div>
          </div>
          <p style="margin:0;color:rgba(255,255,255,0.72);font-size:14px;line-height:1.7;">
            If you believe you should have staff access, please contact the UniSync administration team and request the appropriate role assignment.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(req) {
  try {
    const { email, name, roleLabel, attemptedPath } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.ADMIN_ALERT_FROM_EMAIL ||
      process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "Email provider is not configured",
      });
    }

    const subject = "UniSync staff-only access notice";
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject,
        html: buildEmailHtml({ name, roleLabel, attemptedPath }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.error?.message ||
            "Failed to send access alert email",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id || null });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message || "Failed to process admin access alert request",
      },
      { status: 500 }
    );
  }
}
