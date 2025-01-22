import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";

// Simulated fetch function to get blog posts from a backend API
const fetchBlogs = async (page = 1, pageSize = 5) => {
  try {
    const response = await fetch(
      `https://api.example.com/blogs?page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const data = await response.json();
    return data; // Should contain { blogs: Array, totalCount: Number }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [], totalCount: 0 };
  }
};

// Static data to be used in case of fetch failure
const staticBlogs = [
  {
    title: "Exploring the Beauty of Nature",
    author: "John Doe",
    date: "2025-01-20",
    content:
      "Nature is incredibly beautiful, and exploring it brings peace and joy...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  {
    title: "Travel Tips for Your Next Adventure",
    author: "Jane Smith",
    date: "2025-01-18",
    content:
      "Planning your next adventure? Here are some travel tips to make your journey smoother...",
    image: "https://via.placeholder.com/600",
  },
  // Add more static blog posts here
];

const BlogPostCard = ({ blog }) => (
  <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
    <CardMedia
      component="img"
      height="200"
      image={blog.image || "https://via.placeholder.com/600"}
      alt={blog.title}
    />
    <CardContent>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {blog.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        By {blog.author} on {blog.date}
      </Typography>
      <Typography sx={{ mt: 2 }}>{blog.content}</Typography>
    </CardContent>
  </Card>
);

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      const { blogs, totalCount } = await fetchBlogs(page);
      if (blogs.length === 0) {
        setBlogPosts(staticBlogs); // Use static data if fetch fails
        setTotalBlogs(staticBlogs.length);
      } else {
        setBlogPosts(blogs);
        setTotalBlogs(totalCount);
      }
      setLoading(false);
    };

    loadBlogs();
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Title is required.";
    if (!formData.author) errors.author = "Author is required.";
    if (!formData.content) errors.content = "Content is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setBlogPosts([
        ...blogPosts,
        { ...formData, date: new Date().toLocaleDateString(), image: "" },
      ]);
      setFormData({ title: "", author: "", content: "" });
    }
  };

  const loadMoreBlogs = () => {
    setPage(page + 1);
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#003366",
          mb: 4,
          textAlign: "center",
          fontFamily: "'Smooch Sans', sans-serif",
        }}
      >
        Blog Page
      </Typography>
      <Divider
        sx={{ mb: 4, borderColor: "#003366", width: "50px", mx: "auto" }}
      />

      <Typography variant="h5" sx={{ mb: 4, color: "#00509e" }}>
        Featured Blog
      </Typography>
      {blogPosts[0] && <BlogPostCard blog={blogPosts[0]} />}

      <Typography variant="h5" sx={{ mb: 4, color: "#00509e" }}>
        All Blogs
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.slice(1).map((blog, index) => (
          <Grid item xs={12} md={6} key={index}>
            <BlogPostCard blog={blog} />
          </Grid>
        ))}
      </Grid>

      {loading && <Typography>Loading...</Typography>}

      {totalBlogs > blogPosts.length && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              color: "#fff",
              "&:hover": { backgroundColor: "#00509e" },
            }}
            onClick={loadMoreBlogs}
          >
            See More
          </Button>
        </Box>
      )}

      <Typography variant="h5" sx={{ mt: 6, mb: 2, color: "#00509e" }}>
        Share Your Experience
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 600,
          mx: "auto",
          p: 3,
          boxShadow: 2,
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <FormControl error={Boolean(formErrors.title)}>
          <TextField
            label="Title"
            name="title"
            variant="outlined"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
          />
          {formErrors.title && (
            <FormHelperText>{formErrors.title}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={Boolean(formErrors.author)}>
          <TextField
            label="Author"
            name="author"
            variant="outlined"
            fullWidth
            value={formData.author}
            onChange={handleChange}
            required
          />
          {formErrors.author && (
            <FormHelperText>{formErrors.author}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={Boolean(formErrors.content)}>
          <TextField
            label="Content"
            name="content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formData.content}
            onChange={handleChange}
            required
          />
          {formErrors.content && (
            <FormHelperText>{formErrors.content}</FormHelperText>
          )}
        </FormControl>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#003366",
            color: "#fff",
            "&:hover": { backgroundColor: "#00509e" },
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default Blogs;
