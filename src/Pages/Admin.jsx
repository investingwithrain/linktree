import React, { useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { Logout, Restore, Save } from "@mui/icons-material";

import { ADMIN_EMAILS, auth, googleProvider, isAdminUser } from "../firebase";
import { CONTENT_DOCS, fetchContent, saveContent } from "../useContent";
import LinkListEditor from "./LinkListEditor.jsx";
import BlogEditor, { blogToEntries, entriesToBlog } from "./BlogEditor.jsx";

import dataLinks from "../DataLinks.json";
import social from "../Social.json";
import blog from "../blog.json";

const TABS = [
  { id: CONTENT_DOCS.links, label: "Links", fallback: dataLinks },
  { id: CONTENT_DOCS.social, label: "Social icons", fallback: social },
  { id: CONTENT_DOCS.blog, label: "Blog", fallback: blog },
];

function Admin() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tab, setTab] = useState(0);
  const [content, setContent] = useState({});
  const [dirty, setDirty] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const current = TABS[tab];
  const allowed = isAdminUser(user);

  useEffect(() => onAuthStateChanged(auth, (next) => {
    setUser(next);
    setAuthReady(true);
  }), []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const loaded = {};
    const failed = [];
    // Per-dataset fallback: one unreadable doc must not blank out the others.
    // A doc that has never been saved simply loads the bundled JSON, so the
    // first save seeds Firestore from what the site already ships.
    for (const { id, label, fallback } of TABS) {
      try {
        loaded[id] = await fetchContent(id, fallback);
      } catch (err) {
        console.warn(`[admin] "${id}" read failed, using bundled JSON`, err);
        loaded[id] = fallback;
        failed.push(label);
      }
    }
    setContent(loaded);
    setDirty({});
    setLoading(false);
    if (failed.length) {
      setToast({
        severity: "warning",
        message: `Loaded bundled JSON for ${failed.join(", ")} — Firestore read failed. Check the rules allow reading /content.`,
      });
    }
  }, []);

  useEffect(() => {
    if (allowed) loadAll();
  }, [allowed, loadAll]);

  // Guard against losing edits on refresh or tab close.
  useEffect(() => {
    const hasUnsaved = Object.values(dirty).some(Boolean);
    if (!hasUnsaved) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setCurrent = (value) => {
    setContent((prev) => ({ ...prev, [current.id]: value }));
    setDirty((prev) => ({ ...prev, [current.id]: true }));
  };

  const handleSignIn = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent(current.id, content[current.id], user);
      setDirty((prev) => ({ ...prev, [current.id]: false }));
      setToast({ severity: "success", message: `Saved “${current.label}”.` });
    } catch (err) {
      setToast({
        severity: "error",
        message: `Save failed: ${err.message}. Check the Firestore rules allow ${user?.email}.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    if (!window.confirm(`Discard unsaved changes to “${current.label}” and reload it?`)) return;
    loadAll();
  };

  if (!authReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="flex-start">
            <Typography variant="h4">Linktree admin</Typography>
            <Typography color="text.secondary">
              Sign in with an authorised Google account to edit the links.
            </Typography>
            {authError && <Alert severity="error" sx={{ width: "100%" }}>{authError}</Alert>}
            <Button variant="contained" size="large" onClick={handleSignIn}>
              Sign in with Google
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!allowed) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="flex-start">
            <Typography variant="h4">Not authorised</Typography>
            <Alert severity="warning" sx={{ width: "100%" }}>
              {user.email} is not on the admin list.
              {ADMIN_EMAILS.length === 0 &&
                " No admin emails are configured — set VITE_ADMIN_EMAILS in .env and restart the dev server."}
            </Alert>
            <Button startIcon={<Logout />} onClick={() => signOut(auth)}>
              Sign out
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const value = content[current.id];
  const isDirty = Boolean(dirty[current.id]);

  return (
    <Box sx={{ pb: 8, bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Linktree admin
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={user.photoURL} alt={user.email} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {user.email}
            </Typography>
            <Button startIcon={<Logout />} onClick={() => signOut(auth)}>
              Sign out
            </Button>
          </Stack>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(_, next) => setTab(next)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {TABS.map((item) => (
            <Tab
              key={item.id}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{item.label}</span>
                  {dirty[item.id] && <Chip size="small" color="warning" label="unsaved" />}
                </Stack>
              }
            />
          ))}
        </Tabs>
        {(loading || saving) && <LinearProgress />}
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!isDirty || saving || loading}
            >
              Save {current.label}
            </Button>
            <Button
              startIcon={<Restore />}
              onClick={handleRevert}
              disabled={saving || loading}
            >
              Reload
            </Button>
          </Stack>

          {loading && <Typography color="text.secondary">Loading…</Typography>}

          {!loading && current.id === CONTENT_DOCS.blog && value && (
            <BlogEditor
              entries={blogToEntries(value)}
              featured={value.showThisInLinktree || ""}
              onChange={(entries, featured) => setCurrent(entriesToBlog(entries, featured))}
            />
          )}

          {!loading && current.id !== CONTENT_DOCS.blog && (
            <LinkListEditor
              items={value || []}
              onChange={setCurrent}
              withSourceOverrides={current.id === CONTENT_DOCS.links}
            />
          )}
        </Stack>
      </Container>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={6000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}

export default Admin;
