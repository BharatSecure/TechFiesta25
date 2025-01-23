import React, { useState, useEffect, useRef } from "react";
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
import Footer from "@/components/Footer";

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

const staticBlogs = [
  {
    title: "Making Reporting Easier Than Ever!",
    author: "John Doe",
    date: "2025-01-02",
    content:
      "I was impressed by how user-friendly the platform is. Reporting incidents now feels effortless, and the real-time alerts ensure immediate action. The heatmap analytics are a game-changer for identifying critical areas that need attention. Truly a lifesaver!",
    image:
      "https://files.oaiusercontent.com/file-5P2gc5UJrPHMB2x3S8rADm?se=2025-01-22T11%3A54%3A50Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D57454cdb-70ba-4297-89fc-690fedfaa35f.webp&sig=gJXGKmv9BNcAtrr0e3ngke3SUXJr%2Bb7Vve2tNhgPOV4%3D",
  },
  {
    title: "Heatmap Insights ",
    author: "John Doe",
    date: "2025-01-06",
    content:
      "The heatmap analytics provide great insights into high-risk areas. It has helped our team proactively allocate resources where they’re needed most. This platform is truly transforming how we approach community safety",
    image:
      "https://www.google.com/images/branding/product/2x/maps_96in128dp.png",
  },
  {
    title: " Reliable and Transparent System",
    author: "Maria Gonzales",
    date: "2025-01-03",
    content:
      "I appreciate the end-to-end tracking feature, which keeps me informed about the status of my reports.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIpMbgNj4w-c4oDdaPcNNqvVt_cbLeCH7kVA&s",
  },
  {
    title: "Enhancing Safety",
    author: "James Anderson",
    date: "2025-01-05",
    content:
      "The voice-based reporting option is an excellent addition for accessibility. It shows that this platform is built with inclusivity in mind",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRek89pxIYLa6MGMj7QkGdrQ9BAgjZD1-0MMg&s",
  },
  // Add more static blog posts here
];

const BlogPostCard = ({ blog }) => (
  <Card
    sx={{
      boxShadow: 4,
      borderRadius: 3,
      overflow: "hidden",
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: 6,
      },
    }}
  >
    <CardMedia
      component="img"
      sx={{ height: "250px", objectFit: "cover" }}
      image={blog.image}
      alt={blog.title}
    />
    <CardContent>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#003366", mb: 1 }}
      >
        {blog.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        By {blog.author} on {blog.date}
      </Typography>
      <Typography>{blog.content}</Typography>
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
  const formRef = useRef(null);

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      const { blogs, totalCount } = await fetchBlogs(page);
      if (blogs.length === 0) {
        setBlogPosts(staticBlogs);
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

  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Container sx={{ py: 4, px: 3, backgroundColor: "#ffecd6" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#003366",
              mb: 2,
              fontFamily: "'Smooch Sans', sans-serif",
            }}
          >
            Blog Page
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              color: "#fff",
              "&:hover": { backgroundColor: "#00509e" },
            }}
            onClick={scrollToForm}
          >
            Share Your Opinion
          </Button>
        </Box>
        <Grid container spacing={4}>
          {blogPosts.map((blog, index) => (
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

        <Box ref={formRef} sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#003366",
              mb: 2,
              fontFamily: "'Smooch Sans', sans-serif",
              textAlign: "center",
              fontSize: "2rem",
            }}
          >
            Share Your Thoughts
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

            <FormControl>
              <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                Upload Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormData((prev) => ({
                        ...prev,
                        image: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
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
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Blogs;
