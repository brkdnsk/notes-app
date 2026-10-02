import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/notes";

function App() {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchNotes = async () => {
		try {
			const response = await axios.get(API_URL);
			setNotes(response.data);
		} catch (error) {
			console.error("Notlar getirilirken hata oluştu:", error);
		}
	};

	useEffect(() => {
		fetchNotes();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) return;

		setLoading(true);
		try {
			await axios.post(API_URL, { title, content });
			setTitle("");
			setContent("");
			fetchNotes();
		} catch (error) {
			console.error("Not eklenirken hata oluştu:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`${API_URL}/${id}`);
			fetchNotes();
		} catch (error) {
			console.error("Not silinirken hata oluştu:", error);
		}
	};

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<h1 style={styles.appTitle}>✨ Not Defterim</h1>
				<p style={styles.appSubtitle}>
					Spring Boot & React Full-Stack Projesi
				</p>
			</header>

			{/* Not Ekleme Form Kartı */}
			<div style={styles.card}>
				<h2 style={styles.cardTitle}>Yeni Not Ekle</h2>
				<form onSubmit={handleSubmit} style={styles.form}>
					<input
						type="text"
						placeholder="Not Başlığı..."
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						style={styles.input}
					/>
					<textarea
						placeholder="Not içeriğini buraya yazın..."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows="3"
						style={styles.textarea}
					/>
					<button
						type="submit"
						style={{
							...styles.button,
							opacity: loading ? 0.7 : 1,
							cursor: loading ? "not-allowed" : "pointer",
						}}
						disabled={loading}
					>
						{loading ? "Ekleniyor..." : "➕ Notu Kaydet"}
					</button>
				</form>
			</div>

			{/* Notlar Listesi Bölümü */}
			<section style={styles.section}>
				<div style={styles.sectionHeader}>
					<h2 style={styles.sectionTitle}>Notlarım</h2>
					<span style={styles.badge}>{notes.length} Not</span>
				</div>

				{notes.length === 0 ? (
					<div style={styles.emptyState}>
						<p>
							📭 Henüz hiç not eklenmemiş. Yukarıdan ilk notunu
							oluşturabilirsin!
						</p>
					</div>
				) : (
					<div style={styles.notesGrid}>
						{notes.map((note) => (
							<div key={note.id} style={styles.noteCard}>
								<div style={styles.noteContentWrapper}>
									<h3 style={styles.noteTitle}>{note.title}</h3>
									<p style={styles.noteText}>{note.content}</p>
								</div>
								<button
									onClick={() => handleDelete(note.id)}
									style={styles.deleteButton}
									title="Notu Sil"
								>
									🗑️ Sil
								</button>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}

// Inline stil nesneleri (Modern ve şık bir görünüm için)
const styles = {
	container: {
		maxWidth: "700px",
		margin: "40px auto",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		padding: "0 20px",
		color: "#2d3748",
	},
	header: {
		textAlign: "center",
		marginBottom: "35px",
	},
	appTitle: {
		fontSize: "2.5rem",
		fontWeight: "800",
		color: "#1a202c",
		margin: "0 0 8px 0",
		letterSpacing: "-0.5px",
	},
	appSubtitle: {
		fontSize: "1rem",
		color: "#718096",
		margin: "0",
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: "12px",
		padding: "25px",
		boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
		border: "1px solid #e2e8f0",
		marginBottom: "40px",
	},
	cardTitle: {
		fontSize: "1.2rem",
		fontWeight: "600",
		color: "#2d3748",
		marginTop: "0",
		marginBottom: "20px",
	},
	form: {
		display: "flex",
		flexDirection: "column",
		gap: "15px",
	},
	input: {
		padding: "12px 16px",
		fontSize: "15px",
		borderRadius: "8px",
		border: "1px solid #cbd5e0",
		outline: "none",
		transition: "border-color 0.2s",
	},
	textarea: {
		padding: "12px 16px",
		fontSize: "15px",
		borderRadius: "8px",
		border: "1px solid #cbd5e0",
		outline: "none",
		resize: "vertical",
		fontFamily: "inherit",
	},
	button: {
		padding: "12px",
		fontSize: "16px",
		fontWeight: "600",
		backgroundColor: "#4f46e5",
		color: "white",
		border: "none",
		borderRadius: "8px",
		cursor: "pointer",
		transition: "background-color 0.2s",
	},
	section: {
		marginTop: "20px",
	},
	sectionHeader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "20px",
		borderBottom: "2px solid #edf2f7",
		paddingBottom: "10px",
	},
	sectionTitle: {
		fontSize: "1.5rem",
		fontWeight: "700",
		margin: "0",
		color: "#1a202c",
	},
	badge: {
		backgroundColor: "#e0e7ff",
		color: "#4338ca",
		padding: "4px 12px",
		borderRadius: "20px",
		fontSize: "14px",
		fontWeight: "600",
	},
	emptyState: {
		textAlign: "center",
		padding: "40px",
		backgroundColor: "#f8fafc",
		borderRadius: "12px",
		border: "1px dashed #cbd5e0",
		color: "#718096",
	},
	notesGrid: {
		display: "flex",
		flexDirection: "column",
		gap: "15px",
	},
	noteCard: {
		backgroundColor: "#ffffff",
		borderRadius: "10px",
		padding: "20px",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
		border: "1px solid #e2e8f0",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
		transition: "transform 0.2s, box-shadow 0.2s",
	},
	noteContentWrapper: {
		flex: 1,
		paddingRight: "15px",
	},
	noteTitle: {
		fontSize: "1.1rem",
		fontWeight: "600",
		color: "#2d3748",
		margin: "0 0 8px 0",
	},
	noteText: {
		fontSize: "15px",
		color: "#4a5568",
		margin: "0",
		lineHeight: "1.5",
		whiteSpace: "pre-wrap",
		wordBreak: "break-word",
	},
	deleteButton: {
		backgroundColor: "#fff5f5",
		color: "#e53e3e",
		border: "1px solid #fed7d7",
		padding: "8px 12px",
		borderRadius: "6px",
		cursor: "pointer",
		fontSize: "13px",
		fontWeight: "600",
		transition: "all 0.2s",
	},
};

export default App;
