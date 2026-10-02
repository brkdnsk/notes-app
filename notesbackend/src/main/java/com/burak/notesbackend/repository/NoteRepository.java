package com.burak.notesbackend.repository;

import com.burak.notesbackend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // Ekstra hiçbir SQL yazmamıza gerek yok!
    // JpaRepository bizim için save(), findAll(), findById(), deleteById() gibi
    // tüm temel veritabanı operasyonlarını otomatik olarak hazırlar.
}