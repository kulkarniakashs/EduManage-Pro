package com.edumanagepro.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.fromName:EduManage Pro}")
    private String fromName;

    @Value("${app.mail.fromEmail}")
    private String fromEmail;

    @Value("${app.mail.logoPath:static/logo.png}")
    private String logoPath;

    public void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);

            // IMPORTANT: HTML
            helper.setText(html, true);
            // Add logo inline AFTER setText is fine
            helper.addInline("logo", new ClassPathResource(logoPath));
            System.out.println("html in email :"+ html);
            mailSender.send(message);
        } catch (Exception e) {
            // log, don't crash
            System.out.println("Email send failed: " + e.getMessage());
        }
    }
}