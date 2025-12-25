import { useState } from "react";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import type { Note } from "../types/note";
import Modal from "../Modal/Modal";
import { Toaster } from "react-hot-toast";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [stateModal, setStateModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page, 12),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, 500);

  const openModal = () => {
    setStateModal(true);
  };
  const closeModal = () => {
    setStateModal(false);
  };

  return (
    <>
      <div className={css.app}>
        <Toaster />
        <header className={css.toolbar}>
          <SearchBox searchNote={search} onSearch={handleSearch} />

          {isLoading && <Loader />}
          {isError && <ErrorMessage />}

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
          {stateModal && (
            <Modal onClose={closeModal}>
              <NoteForm onClose={closeModal} />
            </Modal>
          )}
        </header>

        {!isError && !isLoading && notes.length > 0 && (
          <NoteList notes={notes} />
        )}
      </div>
    </>
  );
}
