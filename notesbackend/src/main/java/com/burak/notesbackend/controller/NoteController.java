package com.burak.notesbackend.controller;

import com.burak.notesbackend.model.Note;
import com.burak.notesbackend.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*") // Web ve mobil uygulamaların istek atabilmesi için CORS izni
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // GET: http://localhost:8080/api/notes (Tüm notları listele)
    @GetMapping
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }

    // POST: http://localhost:8080/api/notes (Yeni not ekle)
    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noteService.saveNote(note);
    }

    // DELETE: http://localhost:8080/api/notes/{id} (Not sil)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok().build();
    }
}