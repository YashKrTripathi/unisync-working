export const DEFAULT_CONTACT_MAIL_TEMPLATES = {
  sendAutoReply: "true",
  adminSubject: "UniSync contact inquiry: {{topic}}",
  adminHeading: "New contact form submission",
  adminIntro:
    "{{name}} has sent a new message through the UniSync contact desk.",
  adminMessageLabel: "Message received",
  adminFooter:
    "Review the submission details below and reply directly to the sender if follow-up is needed.",
  userSubject: "We received your message | UniSync",
  userHeading: "Your message reached UniSync",
  userIntro:
    "Hi {{name}}, thank you for reaching out to UniSync regarding {{topic}}.",
  userBody:
    "Our team has received your message and will get back to you as soon as possible.",
  userMessageLabel: "Your submitted message",
  userFooter:
    "If your query is urgent, please reply to this email with any additional details.",
};

const TOKEN_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

export function renderTemplate(template, values) {
  return String(template || "").replace(TOKEN_PATTERN, (_, token) => {
    const value = values[token];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function nl2br(value) {
  return String(value).replace(/\n/g, "<br>");
}

export function shouldSendAutoReply(value) {
  return String(value || "").trim().toLowerCase() !== "false";
}

export function buildContactMailTemplates(content, submission) {
  const templates = {
    ...DEFAULT_CONTACT_MAIL_TEMPLATES,
    ...(content || {}),
  };

  const templateValues = {
    name: submission.name,
    email: submission.email,
    topic: submission.topic,
    message: submission.message,
    source: submission.source,
    submittedAt: submission.submittedAt,
  };

  const adminSubject = renderTemplate(templates.adminSubject, templateValues);
  const adminHeading = renderTemplate(templates.adminHeading, templateValues);
  const adminIntro = renderTemplate(templates.adminIntro, templateValues);
  const adminMessageLabel = renderTemplate(
    templates.adminMessageLabel,
    templateValues
  );
  const adminFooter = renderTemplate(templates.adminFooter, templateValues);

  const adminPlainBody = [
    adminHeading,
    "",
    adminIntro,
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Topic: ${submission.topic}`,
    `Submitted At: ${submission.submittedAt}`,
    `Source: ${submission.source}`,
    "",
    `${adminMessageLabel}:`,
    submission.message,
    "",
    adminFooter,
  ].join("\n");

  const adminHtmlBody =
    `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">` +
    `<h2 style="margin-bottom:16px;">${escapeHtml(adminHeading)}</h2>` +
    `<p>${escapeHtml(adminIntro)}</p>` +
    `<div style="margin-top:18px;padding:16px;border:1px solid #ddd;border-radius:16px;background:#fafafa;">` +
    `<p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(
      submission.name
    )}</p>` +
    `<p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(
      submission.email
    )}</p>` +
    `<p style="margin:0 0 8px;"><strong>Topic:</strong> ${escapeHtml(
      submission.topic
    )}</p>` +
    `<p style="margin:0 0 8px;"><strong>Submitted At:</strong> ${escapeHtml(
      submission.submittedAt
    )}</p>` +
    `<p style="margin:0;"><strong>Source:</strong> ${escapeHtml(
      submission.source
    )}</p>` +
    `</div>` +
    `<div style="margin-top:18px;padding:16px;border:1px solid #ddd;border-radius:16px;background:#fff;">` +
    `<strong>${escapeHtml(adminMessageLabel)}</strong><br><br>` +
    `${nl2br(escapeHtml(submission.message))}` +
    `</div>` +
    `<p style="margin-top:18px;">${escapeHtml(adminFooter)}</p>` +
    `</div>`;

  const userSubject = renderTemplate(templates.userSubject, templateValues);
  const userHeading = renderTemplate(templates.userHeading, templateValues);
  const userIntro = renderTemplate(templates.userIntro, templateValues);
  const userBody = renderTemplate(templates.userBody, templateValues);
  const userMessageLabel = renderTemplate(
    templates.userMessageLabel,
    templateValues
  );
  const userFooter = renderTemplate(templates.userFooter, templateValues);

  const userPlainBody = [
    userHeading,
    "",
    userIntro,
    "",
    userBody,
    "",
    `${userMessageLabel}:`,
    submission.message,
    "",
    userFooter,
  ].join("\n");

  const userHtmlBody =
    `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">` +
    `<h2 style="margin-bottom:16px;">${escapeHtml(userHeading)}</h2>` +
    `<p>${escapeHtml(userIntro)}</p>` +
    `<p>${escapeHtml(userBody)}</p>` +
    `<div style="margin-top:18px;padding:16px;border:1px solid #ddd;border-radius:16px;background:#fafafa;">` +
    `<strong>${escapeHtml(userMessageLabel)}</strong><br><br>` +
    `${nl2br(escapeHtml(submission.message))}` +
    `</div>` +
    `<p style="margin-top:18px;">${escapeHtml(userFooter)}</p>` +
    `</div>`;

  return {
    sendAutoReply: shouldSendAutoReply(templates.sendAutoReply),
    adminSubject,
    adminPlainBody,
    adminHtmlBody,
    userSubject,
    userPlainBody,
    userHtmlBody,
  };
}
