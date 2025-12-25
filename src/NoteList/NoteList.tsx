import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../types/note";
import css from "./NoteList.module.css";
import { deleteNote } from "../services/noteService";
import toast from "react-hot-toast";

interface NoteListProps {
  onSelect: (note: Note) => void;
  notes: Note[];
}

export default function NoteList({ onSelect, notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  const onDeleteNote = (id: string) => {
    deleteteNoteMutation.mutate(id);
  };
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          className={css.listItem}
          key={note.id}
          onClick={() => onSelect(note)}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => onDeleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
