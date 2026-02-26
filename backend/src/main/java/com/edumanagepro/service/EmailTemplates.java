package com.edumanagepro.service;

import java.time.format.DateTimeFormatter;

public class EmailTemplates {

    private static String layout(String title, String bodyHtml) {
        return String.format("""
        <div style="background:#f6f8fb;padding:24px;font-family:Inter,Segoe UI,Arial,sans-serif;">
          <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 6px 24px rgba(15,23,42,0.08);overflow:hidden;"> 
            <div style="padding:18px 22px;border-bottom:1px solid #eef2f7;">
              <div style="height:fit-content;width:100%%;display:flex;justify-content:center;">
                <img style="height:80px;width:80%%;object-fit:contain;" src="cid:logo" alt="EduManage Pro Logo" />
              </div>
            </div>

            <div style="padding:22px;">
              <h2 style="margin:0 0 12px 0;color:#0f172a;font-size:20px;line-height:1.2;">%s</h2>
              <div style="color:#334155;font-size:14px;line-height:1.6;">
                %s
              </div>
            </div>

            <div style="padding:16px 22px;background:#f8fafc;border-top:1px solid #eef2f7;color:#64748b;font-size:12px;">
              <div>EduManage Pro • Institutional LMS</div>
            </div>

          </div>
        </div>
        """, escape(title), bodyHtml);
    }

    public static String accountCreated(String fullName, String email, String password, String role) {
        String body = """
          <p>Hi <b>%s</b>,</p>
          <p>Your <b>%s</b> account has been created on <b>EduManage Pro</b>.</p>

          <div style="margin:14px 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
            <div style="font-size:13px;color:#475569;"><b>Login Email:</b> %s</div>
            <div style="font-size:13px;color:#475569;margin-top:6px;"><b>Password:</b> %s</div>
          </div>

          <p style="margin-top:14px;color:#64748b;font-size:13px;">
            For security, please change your password after first login.
          </p>
        """.formatted(escape(fullName), escape(role), escape(email), escape(password));

        return layout("Your account is ready", body);
    }

    public static String studentEnrolled(String studentName, String className, String academicYearName) {
        String body = """
          <p>Hi <b>%s</b>,</p>
          <p>You have been enrolled successfully.</p>

          <div style="margin:14px 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
            <div style="font-size:13px;color:#475569;"><b>Class:</b> %s</div>
            <div style="font-size:13px;color:#475569;margin-top:6px;"><b>Academic Year:</b> %s</div>
          </div>

          <p style="margin-top:14px;color:#64748b;font-size:13px;">
            You can access content after fee payment (if applicable).
          </p>
        """.formatted(escape(studentName), escape(className), escape(academicYearName));

        return layout("Enrollment confirmed", body);
    }

    public static String teacherAssigned(String teacherName, String subjectName, String className, String academicYearName) {
        String body = """
          <p>Hi <b>%s</b>,</p>
          <p>A subject has been assigned to you.</p>

          <div style="margin:14px 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
            <div style="font-size:13px;color:#475569;"><b>Subject:</b> %s</div>
            <div style="font-size:13px;color:#475569;margin-top:6px;"><b>Class:</b> %s</div>
            <div style="font-size:13px;color:#475569;margin-top:6px;"><b>Academic Year:</b> %s</div>
          </div>

          <p style="margin-top:14px;color:#64748b;font-size:13px;">
            You can now create modules and upload content for this subject.
          </p>
        """.formatted(escape(teacherName), escape(subjectName), escape(className), escape(academicYearName));

        return layout("New subject assigned", body);
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;");
    }
}