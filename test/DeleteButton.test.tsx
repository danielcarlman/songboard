import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteButton from "../components/DeleteButton";
import { useState } from "react";
import { Song } from "@/types";

function DeleteButtonWrapper() {
  const [_, setSongs] = useState<Song[]>([
    { id: "1", userId: "abc", lyrics: "lala", title: "hello" },
  ]);
  return <DeleteButton songId="" setSongs={setSongs} />;
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
});
