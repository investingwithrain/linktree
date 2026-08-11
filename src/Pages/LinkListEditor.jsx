import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  ExpandMore,
  OpenInNew,
} from "@mui/icons-material";

const EMPTY_ITEM = { name: "", description: "", img: "", link: "" };

const FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description" },
  { key: "img", label: "Image URL", required: true },
  {
    key: "link",
    label: "Destination link",
    required: true,
    helper:
      "Paste the real destination URL. On investingwithrain.com links, utm_source/medium/campaign are added automatically when a visitor clicks.",
  },
];

// Editor for the array-of-cards datasets: the link cards and the social icon
// row. Both share the { name, description, img, link } shape.
function LinkListEditor({ items, onChange }) {
  const update = (index, key, value) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    onChange(next);
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index) => {
    const item = items[index];
    const label = item.name || "this entry";
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => onChange([...items, { ...EMPTY_ITEM }]);

  return (
    <Stack spacing={2}>
      {items.length === 0 && (
        <Typography color="text.secondary">
          No entries yet. Use “Add entry” to create the first one.
        </Typography>
      )}

      {items.map((item, index) => (
        <Accordion key={index} defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: "100%", pr: 1 }}
            >
              <Avatar
                src={item.img}
                alt={item.name}
                variant="rounded"
                sx={{ bgcolor: "grey.200" }}
              >
                {index + 1}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography noWrap>{item.name || "(untitled)"}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {item.description || item.link || "—"}
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
                  value={item[field.key] ?? ""}
                  onChange={(e) => update(index, field.key, e.target.value)}
                />
              ))}

              <Stack direction="row" spacing={1}>
                <Tooltip title="Move up">
                  <span>
                    <IconButton
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUpward />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Move down">
                  <span>
                    <IconButton
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                    >
                      <ArrowDownward />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Open destination in a new tab">
                  <span>
                    <IconButton
                      onClick={() => window.open(item.link, "_blank")}
                      disabled={!item.link}
                    >
                      <OpenInNew />
                    </IconButton>
                  </span>
                </Tooltip>
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

export default LinkListEditor;
