package com.edumanagepro.config;

import com.edumanagepro.entity.Institute;
import com.edumanagepro.entity.User;
import com.edumanagepro.entity.enums.UserRole;
import com.edumanagepro.repository.InstituteRepository;
import com.edumanagepro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final InstituteRepository instituteRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${app.seed.institute.code:EDU001}")
    private String instituteCode;

    @Value("${app.seed.institute.name:EduManage Institute}")
    private String instituteName;

    @Value("${app.seed.admin.email:admin@edumanage.com}")
    private String adminEmail;

    @Value("${app.seed.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.seed.admin.fullname:Super Admin}")
    private String adminFullName;

    @Override
    public void run(String... args) {
        if (!seedEnabled) return;

        // 1) Create Institute if not exists
        Institute institute = instituteRepository.findByCode(instituteCode)
                .orElseGet(() -> {
                    Institute i = new Institute();
                    i.setCode(instituteCode);
                    i.setName(instituteName);
                    i.setAddress("N/A");
                    return instituteRepository.save(i);
                });

        // 2) Create Admin if not exists
        String emailLower = adminEmail.toLowerCase();
        if (!userRepository.existsByEmail(emailLower)) {
            User admin = new User();
            admin.setInstitute(institute);
            admin.setFullName(adminFullName);
            admin.setEmail(emailLower);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword)); // ✅ bcrypt
            admin.setRole(UserRole.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);

            System.out.println("✅ Seeded default ADMIN: " + emailLower + " / " + adminPassword);
        } else {
            System.out.println("ℹ️ Admin already exists: " + emailLower);
        }
    }
}
