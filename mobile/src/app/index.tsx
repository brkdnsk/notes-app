import axios from "axios";
import { useEffect, useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const API_URL = "http://localhost:8080/api/notes";

interface Note {
	id: number;
	title: string;
	content: string;
}

export default function App() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchNotes = async () => {
		try {
			const response = await axios.get<Note[]>(API_URL);
			setNotes(response.data);
		} catch (error) {
			console.error("Notlar getirilirken hata oluştu:", error);
		}
	};

	useEffect(() => {
		fetchNotes();
	}, []);

	const handleSubmit = async () => {
		if (!title.trim() || !content.trim()) return;

		setLoading(true);
		try {
			if (editingId) {
				// Güncelleme (PUT)
				await axios.put(`${API_URL}/${editingId}`, { title, content });
				setEditingId(null);
			} else {
				// Yeni Kayıt (POST)
				await axios.post(API_URL, { title, content });
			}
			setTitle("");
			setContent("");
			fetchNotes();
		} catch (error) {
			console.error("İşlem sırasında hata oluştu:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (note: Note) => {
		setEditingId(note.id);
		setTitle(note.title);
		setContent(note.content);
	};

	const handleDelete = async (id: number) => {
		try {
			await axios.delete(`${API_URL}/${id}`);
			fetchNotes();
		} catch (error) {
			console.error("Not silinirken hata oluştu:", error);
		}
	};

	const renderItem = ({ item }: { item: Note }) => (
		<View style={styles.noteCard}>
			<View style={styles.noteInfo}>
				<Text style={styles.noteTitle}>{item.title}</Text>
				<Text style={styles.noteContent}>{item.content}</Text>
			</View>
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={styles.editButton}
					onPress={() => handleEdit(item)}
				>
					<Text style={styles.editButtonText}>Düzenle</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => handleDelete(item.id)}
				>
					<Text style={styles.deleteButtonText}>Sil</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.innerContainer}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Not Defteri</Text>
					<Text style={styles.subtitle}>
						Spring Boot & React Native Mobil Paneli
					</Text>
				</View>

				<View style={styles.formSection}>
					<Text style={styles.sectionTitle}>
						{editingId ? "Notu Düzenle" : "Yeni Not Oluştur"}
					</Text>
					<TextInput
						style={styles.input}
						placeholder="Başlık girin..."
						placeholderTextColor="#64748b"
						value={title}
						onChangeText={setTitle}
					/>
					<TextInput
						style={[styles.input, styles.textarea]}
						placeholder="Not içeriğini buraya yazın..."
						placeholderTextColor="#64748b"
						value={content}
						onChangeText={setContent}
						multiline
					/>
					<View style={styles.buttonRow}>
						<TouchableOpacity
							style={[
								styles.button,
								loading && { opacity: 0.7 },
								{ flex: 1 },
							]}
							onPress={handleSubmit}
							disabled={loading}
						>
							<Text style={styles.buttonText}>
								{loading
									? "İşleniyor..."
									: editingId
									? "Güncelle"
									: "Notu Kaydet"}
							</Text>
						</TouchableOpacity>
						{editingId && (
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => {
									setEditingId(null);
									setTitle("");
									setContent("");
								}}
							>
								<Text style={styles.cancelButtonText}>İptal</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>

				<View style={styles.listHeader}>
					<Text style={styles.sectionTitle}>Kayıtlı Notlar</Text>
					<Text style={styles.counter}>{notes.length} Adet</Text>
				</View>

				{notes.length === 0 ? (
					<View style={styles.emptyBox}>
						<Text style={styles.emptyText}>
							Veritabanında henüz kayıtlı bir not bulunmuyor.
						</Text>
					</View>
				) : (
					<FlatList<Note>
						data={notes}
						renderItem={renderItem}
						keyExtractor={(item) => item.id.toString()}
						contentContainerStyle={styles.listContainer}
					/>
				)}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0f172a",
	},
	innerContainer: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	header: {
		borderBottomWidth: 1,
		borderBottomColor: "#1e293b",
		paddingBottom: 15,
		marginBottom: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
		color: "#ffffff",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 13,
		color: "#94a3b8",
	},
	formSection: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#e2e8f0",
		marginBottom: 12,
	},
	input: {
		backgroundColor: "#1e293b",
		borderWidth: 1,
		borderColor: "#334155",
		borderRadius: 6,
		padding: 12,
		color: "#ffffff",
		fontSize: 14,
		marginBottom: 12,
	},
	textarea: {
		height: 80,
		textAlignVertical: "top",
	},
	buttonRow: {
		flexDirection: "row",
		gap: 10,
	},
	button: {
		backgroundColor: "#3b82f6",
		borderRadius: 6,
		padding: 14,
		alignItems: "center",
	},
	buttonText: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "600",
	},
	cancelButton: {
		borderWidth: 1,
		borderColor: "#334155",
		borderRadius: 6,
		paddingVertical: 14,
		paddingHorizontal: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	cancelButtonText: {
		color: "#94a3b8",
		fontSize: 14,
		fontWeight: "600",
	},
	listHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#1e293b",
		paddingBottom: 8,
		marginBottom: 12,
	},
	counter: {
		fontSize: 13,
		color: "#94a3b8",
	},
	emptyBox: {
		padding: 30,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#334155",
		borderStyle: "dashed",
		borderRadius: 6,
		marginTop: 10,
	},
	emptyText: {
		fontSize: 13,
		color: "#64748b",
		textAlign: "center",
	},
	listContainer: {
		paddingBottom: 20,
	},
	noteCard: {
		backgroundColor: "#1e293b",
		borderWidth: 1,
		borderColor: "#334155",
		borderRadius: 6,
		padding: 14,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 10,
	},
	noteInfo: {
		flex: 1,
		marginRight: 10,
	},
	noteTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#f8fafc",
		marginBottom: 4,
	},
	noteContent: {
		fontSize: 13,
		color: "#94a3b8",
		lineHeight: 18,
	},
	actionButtons: {
		gap: 6,
	},
	editButton: {
		borderWidth: 1,
		borderColor: "#0369a1",
		borderRadius: 6,
		paddingVertical: 6,
		paddingHorizontal: 10,
		alignItems: "center",
	},
	editButtonText: {
		color: "#38bdf8",
		fontSize: 12,
		fontWeight: "600",
	},
	deleteButton: {
		borderWidth: 1,
		borderColor: "#7f1d1d",
		borderRadius: 6,
		paddingVertical: 6,
		paddingHorizontal: 10,
		alignItems: "center",
	},
	deleteButtonText: {
		color: "#ef4444",
		fontSize: 12,
		fontWeight: "600",
	},
});
