"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  useGetIdentity,
  useOne,
  useUpdate,
  HttpError,
} from "@refinedev/core";
import { useTranslations } from "next-intl";
import { EditButton } from "@refinedev/mui";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";

interface Task {
  id: number;
  task: string;
  completed: boolean;
  archived: boolean;
}

interface Note {
  id: number;
  note: string;
  archived: boolean;
}

interface ProfileData {
  id: string;
  avatar?: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  streetaddress: string;
  city: string;
  country: string;
  zip: string;
  role: string;
  // JSONB columns: tasks is an array of Task objects, notes is an array of Note objects.
  tasks?: Task[];
  notes?: Note[];
}

export default function ProfilePage() {
  const t = useTranslations("Profile");

  // Get the current user's identity.
  const { data: identity } = useGetIdentity<{ id: string }>();
  const userId = identity?.id ?? "";

  // Fetch the profile data.
  const { data, isLoading, isError } = useOne<ProfileData, HttpError>({
    id: userId,
    meta: { select: "*" },
  });

  // Use refine's update hook.
  const { mutate: updateProfile } = useUpdate<ProfileData>();

  // Local state for tasks and notes.
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTask, setNewTask] = React.useState("");
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [newNote, setNewNote] = React.useState("");

  // State for filter dropdowns.
  const [taskFilter, setTaskFilter] = React.useState<"active" | "archived">("active");
  const [noteFilter, setNoteFilter] = React.useState<"active" | "archived">("active");

  // Initialize local state when profile data loads.
  React.useEffect(() => {
    if (data?.data) {
      setTasks(
        data.data.tasks || [
          { id: 1, task: "Complete profile update", completed: false, archived: false },
          { id: 2, task: "Review new notifications", completed: false, archived: false },
        ]
      );
      setNotes(data.data.notes || []);
    }
  }, [data]);

  if (!userId) return <Typography>Loading...</Typography>;
  if (isLoading || !data?.data) return <Typography>Loading profile...</Typography>;
  if (isError) return <Typography>Error loading profile</Typography>;

  const profile = data.data;

  // TASK FUNCTIONS
  const addTask = () => {
    if (newTask.trim() === "") return;
    const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const updatedTasks = [
      ...tasks,
      { id: nextId, task: newTask.trim(), completed: false, archived: false },
    ];
    setTasks(updatedTasks);
    setNewTask("");
    updateProfile({ resource: "profiles", id: profile.id, values: { tasks: updatedTasks } });
  };

  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    updateProfile({ resource: "profiles", id: profile.id, values: { tasks: updatedTasks } });
  };

  const modifyTask = (id: number) => {
    const taskToModify = tasks.find((task) => task.id === id);
    if (!taskToModify) return;
    const newText = prompt("Edit task:", taskToModify.task);
    if (newText === null) return;
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, task: newText } : task
    );
    setTasks(updatedTasks);
    updateProfile({ resource: "profiles", id: profile.id, values: { tasks: updatedTasks } });
  };

  const archiveTask = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, archived: true } : task
    );
    setTasks(updatedTasks);
    updateProfile({ resource: "profiles", id: profile.id, values: { tasks: updatedTasks } });
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    updateProfile({ resource: "profiles", id: profile.id, values: { tasks: updatedTasks } });
  };

  // NOTE FUNCTIONS
  const addNote = () => {
    if (newNote.trim() === "") return;
    const nextId = notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    const updatedNotes = [
      ...notes,
      { id: nextId, note: newNote.trim(), archived: false },
    ];
    setNotes(updatedNotes);
    setNewNote("");
    updateProfile({ resource: "profiles", id: profile.id, values: { notes: updatedNotes } });
  };

  const modifyNote = (id: number) => {
    const noteToModify = notes.find((n) => n.id === id);
    if (!noteToModify) return;
    const newText = prompt("Edit note:", noteToModify.note);
    if (newText === null) return;
    const updatedNotes = notes.map((n) =>
      n.id === id ? { ...n, note: newText } : n
    );
    setNotes(updatedNotes);
    updateProfile({ resource: "profiles", id: profile.id, values: { notes: updatedNotes } });
  };

  const archiveNote = (id: number) => {
    const updatedNotes = notes.map((n) =>
      n.id === id ? { ...n, archived: true } : n
    );
    setNotes(updatedNotes);
    updateProfile({ resource: "profiles", id: profile.id, values: { notes: updatedNotes } });
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    updateProfile({ resource: "profiles", id: profile.id, values: { notes: updatedNotes } });
  };

  // Filtered lists based on dropdown selections.
  const filteredTasks = tasks.filter((t) =>
    taskFilter === "active" ? !t.archived : t.archived
  );
  const filteredNotes = notes.filter((n) =>
    noteFilter === "active" ? !n.archived : n.archived
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Profile
      </Typography>
      <Grid container spacing={4}>
        {/* Left Column: Profile Card and Personal Notes */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            {/* Profile Card */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, maxWidth: 450, margin: "auto" }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    backgroundColor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Typography variant="h4" color="primary">
                        {profile.fullname ? profile.fullname.charAt(0).toUpperCase() : "?"}
                      </Typography>
                    )}
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {profile.fullname || "No Name"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("email")}: {profile.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("username")}: {profile.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("phone")}: {profile.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("address")}: {profile.streetaddress}, {profile.city}, {profile.country} {profile.zip}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("role")}: {profile.role}
                  </Typography>
                </CardContent>
                <CardActions>
                  <EditButton hideText recordItemId={profile.id} />
                </CardActions>
              </Card>
            </Grid>
            {/* Personal Notes Card */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, maxWidth: 450, margin: "auto" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Personal Notes
                  </Typography>
                  <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      multiline
                      label="New Note"
                      variant="outlined"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={addNote}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ mb: 2, minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="notes-filter-label">View</InputLabel>
                      <Select
                        labelId="notes-filter-label"
                        value={noteFilter}
                        label="View"
                        onChange={(e) =>
                          setNoteFilter(e.target.value as "active" | "archived")
                        }
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {filteredNotes.length > 0 ? (
                    <List>
                      {filteredNotes.map((note) => (
                        <ListItem
                          key={note.id}
                          secondaryAction={
                            <Box>
                              <IconButton
                                edge="end"
                                aria-label="modify"
                                onClick={() => modifyNote(note.id)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="archive"
                                onClick={() => archiveNote(note.id)}
                              >
                                <ArchiveIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => deleteNote(note.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemText primary={note.note} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No {noteFilter} notes available.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        {/* Right Column: Todo List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, maxWidth: 450, margin: "auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Todo List
              </Typography>
              <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                  fullWidth
                  label="New Task"
                  variant="outlined"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={addTask}>
                  Add
                </Button>
              </Box>
              <Box sx={{ mb: 2, minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="tasks-filter-label">View</InputLabel>
                  <Select
                    labelId="tasks-filter-label"
                    value={taskFilter}
                    label="View"
                    onChange={(e) =>
                      setTaskFilter(e.target.value as "active" | "archived")
                    }
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {filteredTasks.length > 0 ? (
                <List>
                  {filteredTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      secondaryAction={
                        <Box>
                          <IconButton
                            edge="end"
                            aria-label="modify"
                            onClick={() => modifyTask(task.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="archive"
                            onClick={() => archiveTask(task.id)}
                          >
                            <ArchiveIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteTask(task.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.task}
                        sx={{ textDecoration: task.completed ? "line-through" : "none" }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No {taskFilter} tasks available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
