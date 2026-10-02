package com.burak.notesbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Notun benzersiz kimliği (Otomatik artar: 1, 2, 3...)

    @Column(nullable = false)
    private String title; // Not başlığı (Boş bırakılamaz)

    @Column(columnDefinition = "TEXT")
    private String content; // Not içeriği (Uzun metinler için TEXT türü)
}