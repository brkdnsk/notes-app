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
		<div style={styles.page}>
			<div style={styles.container}>
				{/* Başlık Alanı */}
				<header style={styles.header}>
					<h1 style={styles.title}>Not Defteri</h1>
					<p style={styles.subtitle}>
						Spring Boot ve React Yönetim Paneli
					</p>
				</header>

				{/* Not Ekleme Formu */}
				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Yeni Not Oluştur</h2>
					<form onSubmit={handleSubmit} style={styles.form}>
						<div style={styles.inputGroup}>
							<label style={styles.label}>Başlık</label>
							<input
								type="text"
								placeholder="Not başlığını girin..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								style={styles.input}
							/>
						</div>
						<div style={styles.inputGroup}>
							<label style={styles.label}>İçerik</label>
							<textarea
								placeholder="Not içeriğini buraya yazın..."
								value={content}
								onChange={(e) => setContent(e.target.value)}
								rows={4}
								style={styles.textarea}
							/>
						</div>
						<button
							type="submit"
							style={{
								...styles.button,
								opacity: loading ? 0.7 : 1,
								cursor: loading ? "not-allowed" : "pointer",
							}}
							disabled={loading}
						>
							{loading ? "Kaydediliyor..." : "Notu Kaydet"}
						</button>
					</form>
				</section>

				{/* Notlar Listesi */}
				<section style={styles.section}>
					<div style={styles.listHeader}>
						<h2 style={styles.sectionTitle}>Kayıtlı Notlar</h2>
						<span style={styles.counter}>{notes.length} Adet</span>
					</div>

					{notes.length === 0 ? (
						<div style={styles.emptyBox}>
							<p style={styles.emptyText}>
								Veritabanında henüz kayıtlı bir not bulunmuyor.
							</p>
						</div>
					) : (
						<div style={styles.notesContainer}>
							{notes.map((note) => (
								<article key={note.id} style={styles.noteCard}>
									<div style={styles.noteInfo}>
										<h3 style={styles.noteTitle}>{note.title}</h3>
										<p style={styles.noteContent}>{note.content}</p>
									</div>
									<button
										onClick={() => handleDelete(note.id)}
										style={styles.deleteButton}
									>
										Sil
									</button>
								</article>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

// Tüm arkaplanı tek renk yapan ve Türkçe metinler içeren kurumsal stil yapısı
const styles = {
	page: {
		backgroundColor: "#0f172a", // Tüm sayfa arka planı tek renk
		minHeight: "100vh",
		width: "100%",
		margin: "0",
		padding: "40px 20px",
		boxSizing: "border-box",
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		color: "#f8fafc",
	},
	container: {
		maxWidth: "750px",
		margin: "0 auto",
		display: "flex",
		flexDirection: "column",
		gap: "30px",
	},
	header: {
		textAlign: "left",
		borderBottom: "1px solid #1e293b",
		paddingBottom: "20px",
	},
	title: {
		fontSize: "1.75rem",
		fontWeight: "700",
		margin: "0 0 6px 0",
		color: "#ffffff",
	},
	subtitle: {
		fontSize: "0.9rem",
		color: "#94a3b8",
		margin: "0",
	},
	section: {
		display: "flex",
		flexDirection: "column",
		gap: "16px",
	},
	sectionTitle: {
		fontSize: "1.1rem",
		fontWeight: "600",
		color: "#e2e8f0",
		margin: "0",
	},
	form: {
		display: "flex",
		flexDirection: "column",
		gap: "14px",
		backgroundColor: "#0f172a",
	},
	inputGroup: {
		display: "flex",
		flexDirection: "column",
		gap: "6px",
	},
	label: {
		fontSize: "0.85rem",
		fontWeight: "500",
		color: "#cbd5e1",
	},
	input: {
		backgroundColor: "#1e293b",
		border: "1px solid #334155",
		borderRadius: "6px",
		padding: "12px",
		color: "#ffffff",
		fontSize: "0.9rem",
		outline: "none",
	},
	textarea: {
		backgroundColor: "#1e293b",
		border: "1px solid #334155",
		borderRadius: "6px",
		padding: "12px",
		color: "#ffffff",
		fontSize: "0.9rem",
		outline: "none",
		resize: "vertical",
		fontFamily: "inherit",
	},
	button: {
		backgroundColor: "#3b82f6",
		color: "#ffffff",
		border: "none",
		borderRadius: "6px",
		padding: "12px",
		fontSize: "0.9rem",
		fontWeight: "600",
		cursor: "pointer",
		transition: "background-color 0.2s",
	},
	listHeader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottom: "1px solid #1e293b",
		paddingBottom: "12px",
	},
	counter: {
		fontSize: "0.85rem",
		color: "#94a3b8",
	},
	emptyBox: {
		padding: "30px",
		textAlign: "center",
		border: "1px dashed #334155",
		borderRadius: "6px",
	},
	emptyText: {
		fontSize: "0.9rem",
		color: "#64748b",
		margin: "0",
	},
	notesContainer: {
		display: "flex",
		flexDirection: "column",
		gap: "12px",
	},
	noteCard: {
		backgroundColor: "#1e293b",
		border: "1px solid #334155",
		borderRadius: "6px",
		padding: "16px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	noteInfo: {
		flex: 1,
		paddingRight: "15px",
	},
	noteTitle: {
		fontSize: "1rem",
		fontWeight: "600",
		color: "#f8fafc",
		margin: "0 0 6px 0",
	},
	noteContent: {
		fontSize: "0.9rem",
		color: "#94a3b8",
		margin: "0",
		lineHeight: "1.4",
		wordBreak: "break-word",
	},
	deleteButton: {
		backgroundColor: "transparent",
		color: "#ef4444",
		border: "1px solid #7f1d1d",
		borderRadius: "6px",
		padding: "6px 12px",
		fontSize: "0.8rem",
		fontWeight: "600",
		cursor: "pointer",
	},
};

export default App;
