package com.burak.notesbackend.service;

import com.burak.notesbackend.model.Note;
import com.burak.notesbackend.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    // Constructor Injection (Bağımlılık Enjeksiyonu)
    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    // 1. Tüm notları getir
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    // 2. ID'ye göre tek bir not getir
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    // 3. Yeni not oluştur veya mevcut olanı güncelle
    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }

    // 4. Notu ID'ye göre sil
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}