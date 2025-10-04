import { FormEvent, useState } from 'react';
import './PromptForm.css';

type PromptFormProps = {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

function PromptForm({ onSubmit, isLoading, error }: PromptFormProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    await onSubmit(prompt);
    setPrompt('');
  };

  return (
    <form className="prompt" onSubmit={handleSubmit}>
      <label htmlFor="prompt" className="prompt__label">
        Customize your day:
      </label>
      <textarea
        id="prompt"
        className="prompt__input"
        placeholder="Example: Start near Seoul Station, add a market lunch, somewhere scenic before sunset."
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={3}
      />
      {error ? <p className="prompt__error">{error}</p> : null}
      <button type="submit" className="prompt__submit" disabled={isLoading}>
        {isLoading ? 'Crafting...' : 'Generate Options'}
      </button>
    </form>
  );
}

export default PromptForm;
