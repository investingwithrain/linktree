import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Delete, ExpandMore } from "@mui/icons-material";

const FIELDS = [
  { key: "folder", label: "Folder", required: true, helper: "Folder name under src/data — also the /blog/:folder route segment." },
  { key: "md", label: "Markdown file", required: true, helper: "File name inside the folder, e.g. article.md" },
  { key: "description", label: "Description" },
  { key: "img", label: "Cover image URL" },
  { key: "link", label: "Call-to-action link" },
  { key: "linkName", label: "Call-to-action label" },
];

const EMPTY_ENTRY = {
  folder: "",
  md: "",
  description: "",
  img: "",
  link: "",
  linkName: "",
  published: false,
};

// blog.json is keyed by folder: { showThisInLinktree, list: { [folder]: entry } }.
// The editor works on a plain array so entries can be added and removed
// without key juggling, then rebuilds the keyed shape on save.
export function blogToEntries(blog) {
  const list = blog?.list || {};
  return Object.entries(list).map(([folder, entry]) => ({
    ...EMPTY_ENTRY,
    ...entry,
    folder: entry.folder || folder,
  }));
}

export function entriesToBlog(entries, featured) {
  const list = {};
  entries.forEach((entry) => {
    if (!entry.folder) return;
    list[entry.folder] = { ...entry };
  });
  return {
    // Only keep the featured pointer if that folder still exists.
    showThisInLinktree: list[featured] ? featured : "",
    list,
  };
}

function BlogEditor({ entries, featured, onChange }) {
  const update = (index, key, value) => {
    const next = entries.map((entry, i) =>
      i === index ? { ...entry, [key]: value } : entry
    );
    onChange(next, featured);
  };

  const remove = (index) => {
    const entry = entries[index];
    const label = entry.folder || "this entry";
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    onChange(
      entries.filter((_, i) => i !== index),
      featured
    );
  };

  const add = () => onChange([...entries, { ...EMPTY_ENTRY }], featured);

  const duplicateFolders = entries
    .map((entry) => entry.folder)
    .filter((folder, i, all) => folder && all.indexOf(folder) !== i);

  return (
    <Stack spacing={2}>
      <TextField
        select
        fullWidth
        size="small"
        label="Featured on the Linktree homepage"
        helperText="The single blog card shown above the links. Choose “None” to hide it."
        value={entries.some((e) => e.folder === featured) ? featured : ""}
        onChange={(e) => onChange(entries, e.target.value)}
      >
        <MenuItem value="">None</MenuItem>
        {entries
          .filter((entry) => entry.folder)
          .map((entry) => (
            <MenuItem key={entry.folder} value={entry.folder}>
              {entry.folder}
            </MenuItem>
          ))}
      </TextField>

      {duplicateFolders.length > 0 && (
        <Alert severity="warning">
          Duplicate folder {duplicateFolders.length === 1 ? "name" : "names"}:{" "}
          {[...new Set(duplicateFolders)].join(", ")}. Entries are keyed by
          folder, so saving will keep only the last one of each.
        </Alert>
      )}

      {entries.length === 0 && (
        <Typography color="text.secondary">
          No blog entries yet. Use “Add entry” to create the first one.
        </Typography>
      )}

      {entries.map((entry, index) => (
        <Accordion key={index} defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: "100%", pr: 1 }}
            >
              <Avatar
                src={entry.img}
                alt={entry.folder}
                variant="rounded"
                sx={{ bgcolor: "grey.200" }}
              >
                {index + 1}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography noWrap>{entry.folder || "(no folder)"}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {entry.published ? "Published" : "Draft"}
                  {entry.description ? ` — ${entry.description}` : ""}
                </Typography>
              </Box>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Stack spacing={2}>
              {FIELDS.map((field) => (
                <TextField
                  key={field.key}
                  fullWidth
                  size="small"
                  label={field.label}
                  required={field.required}
                  helperText={field.helper}
                  value={entry[field.key] ?? ""}
                  onChange={(e) => update(index, field.key, e.target.value)}
                />
              ))}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(entry.published)}
                    onChange={(e) =>
                      update(index, "published", e.target.checked)
                    }
                  />
                }
                label="Published"
              />

              <Stack direction="row">
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Delete entry">
                  <IconButton color="error" onClick={() => remove(index)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box>
        <Button startIcon={<Add />} onClick={add}>
          Add entry
        </Button>
      </Box>
    </Stack>
  );
}

export default BlogEditor;
