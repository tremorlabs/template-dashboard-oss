'use client';

import { useEffect, useState } from 'react';
import { Divider, TextInput } from '@tremor/react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/Dialog'; 

export default function Example() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const isDirty =
    firstName.trim() !== initialFirstName ||
    lastName.trim() !== initialLastName;

  useEffect(() => {
    const supabase = createClient();

    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? '');

      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      const first = data?.first_name ?? '';
      const last = data?.last_name ?? '';

      setFirstName(first);
      setLastName(last);
      setInitialFirstName(first);
      setInitialLastName(last);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName.trim(), last_name: lastName.trim() })
      .eq('id', userId);
    
    if(!error) {
      window.location.reload();
      return;
    }

    setSaving(false);
    setMessage(
      error
        ? { type: 'error', text: error.message }
        : { type: 'ok', text: 'Changes saved' },
    );
  };

  return (
    <>
      <div className="sm:mx-auto sm:max-w-2xl">
        <h3 className="mt-6 text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Account details
        </h3>
        <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          Update personal information used for account management and billing.
        </p>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="first-name"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                First name
              </label>
              <TextInput
                type="text"
                id="first-name"
                name="first-name"
                autoComplete="given-name"
                className="mt-2 rounded-tremor-small"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label
                htmlFor="last-name"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Last name
              </label>
              <TextInput
                type="text"
                id="last-name"
                name="last-name"
                autoComplete="family-name"
                className="mt-2 rounded-tremor-small"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-span-full">
              <label
                htmlFor="email"
                className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
              >
                Email
              </label>
              <TextInput
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="mt-2 rounded-tremor-small opacity-70"
                value={email}
                readOnly
              />
            </div>
          </div>
          <Divider className="my-12" />
          <div>
            <h3 className="mt-6 text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Notifications
            </h3>
            <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              Manage your personal notification settings for this workspace.
              Read the{' '}
              <a
                href="#"
                className="text-tremor-brand hover:underline hover:underline-offset-4 dark:text-dark-tremor-brand"
              >
                governance documentation
              </a>{' '}
              to learn more.
            </p>
            <div className="mt-8 space-y-6">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="form-option-1"
                    aria-describedby="form-option-1-description"
                    name="form-option-1"
                    type="checkbox"
                    className="size-4 rounded border-tremor-border text-tremor-brand shadow-tremor-input focus:ring-tremor-brand-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-brand dark:shadow-dark-tremor-input dark:focus:ring-dark-tremor-brand-muted"
                  />
                </div>
                <div className="ml-3 text-tremor-default leading-6">
                  <label
                    htmlFor="form-option-1"
                    className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Receive newsletter
                  </label>
                  <p
                    id="form-option-1-description"
                    className="text-tremor-content dark:text-dark-tremor-content"
                  >
                    I want to receive updates from Company about relevant
                    products or services.
                  </p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="form-option-2"
                    aria-describedby="form-option-2-description"
                    name="form-option-2"
                    type="checkbox"
                    className="size-4 rounded border-tremor-border text-tremor-brand shadow-tremor-input focus:ring-tremor-brand-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-brand dark:shadow-dark-tremor-input dark:focus:ring-dark-tremor-brand-muted"
                  />
                </div>
                <div className="ml-3 text-tremor-default leading-6">
                  <label
                    htmlFor="form-option-2"
                    className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Member activities
                  </label>
                  <p
                    id="form-option-2-description"
                    className="text-tremor-content dark:text-dark-tremor-content"
                  >
                    Stay informed and receive notifications when new team
                    members join or leave this workspace.
                  </p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="form-option-3"
                    aria-describedby="form-option-3-description"
                    name="form-option-3"
                    type="checkbox"
                    className="size-4 rounded border-tremor-border text-tremor-brand shadow-tremor-input focus:ring-tremor-brand-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-brand dark:shadow-dark-tremor-input dark:focus:ring-dark-tremor-brand-muted"
                  />
                </div>
                <div className="ml-3 text-tremor-default leading-6">
                  <label
                    htmlFor="form-option-3"
                    className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                  >
                    Deployment activities
                  </label>
                  <p
                    id="form-option-3-description"
                    className="text-tremor-content dark:text-dark-tremor-content"
                  >
                    Receive notifications of successful or failed deployment of
                    this workspace. Read the{' '}
                    <a
                      href="#"
                      className="text-tremor-brand hover:underline hover:underline-offset-4 dark:text-dark-tremor-brand"
                    >
                      Workspace documentation
                    </a>{' '}
                    to learn more.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Divider />
          {message && (
            <p
              className={`mb-4 text-sm ${
                message.type === 'ok' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {message.text}
            </p>
          )}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => (isDirty ? setDialogOpen(true) : router.back())}
              className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/60 disabled:text-gray-400 disabled:dark:text-gray-600"
            >
              Cancel
            </button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Discard changes?</DialogTitle>
                  <Divider className="my-5" />
                  <DialogDescription>
                    If you leave now, the unsaved changes will be lost and you will return to the previous page.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex gap-2">
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Continue editing
                    </button>
                  </DialogClose>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Yes, leave
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              type="submit"
              disabled={saving || loading || !isDirty}
              className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500 border-transparent text-white dark:text-white bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-blue-300 disabled:text-white disabled:dark:bg-blue-800 disabled:dark:text-blue-400"
            >
              {saving ? 'Saving...' : 'Save settings'}
            </button>

            <button
              type="submit"
              disabled={saving || loading}
              className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500 border-transparent text-white dark:text-white bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-blue-300 disabled:text-white disabled:dark:bg-blue-800 disabled:dark:text-blue-400"
            >
              {saving ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}