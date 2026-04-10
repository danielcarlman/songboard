import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteButton from "../components/DeleteButton";
import { useState } from "react";
import { Song } from "@/types";

const mockSongs: Song[] = [
  { id: "1", userId: "abc", lyrics: "lala", title: "hello" },
  { id: "2", userId: "abc", lyrics: "lala", title: "world" },
];

function DeleteButtonWrapper() {
  const [_, setSongs] = useState<Song[]>([mockSongs[0]]);
  return <DeleteButton songId="1" setSongs={setSongs} />;
}

function DeleteButtonWrapperWithTwoSongs() {
  const [songs, setSongs] = useState<Song[]>([...mockSongs]);
  return (
    <>
      {songs.map((song) => (
        <DeleteButton key={song.id} songId={song.id} setSongs={setSongs} />
      ))}
    </>
  );
}

describe("<DeleteButton />", () => {
  test("should add <button/> to the page", () => {
    render(<DeleteButtonWrapper />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("should be tab accessible", async () => {
    render(<DeleteButtonWrapper />);
    const button = screen.getByRole("button");
    await userEvent.tab();
    expect(button).toHaveFocus();
  });

  test("should be labeled as Delete Song", () => {
    render(<DeleteButtonWrapper />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Delete Song");
  });

  test("should delete the song on button click", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

    render(<DeleteButtonWrapperWithTwoSongs />);
    const buttons = screen.getAllByRole("button");
    await act(async () => {
      await userEvent.click(buttons[0]);
    });
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
