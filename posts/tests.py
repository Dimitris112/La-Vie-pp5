from django.contrib.auth.models import User
from .models import Post
from rest_framework.test import APITestCase
from rest_framework import status


class PostListViewTests(APITestCase):
    def setUp(self):
        User.objects.create_user(
            username='dimitris',
            password='12345'
        )
    
    def test_can_list_posts(self):
        dimitris = User.objects.get(username='dimitris')
        Post.objects.create(owner=dimitris, title='a title')
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_post(self):
        self.client.login(username='dimitris', password='12345')
        response = self.client.post('/posts/', {'title': 'a title'})
        count = Post.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_out_user_cant_create_post(self):
        response = self.client.post('/posts/', {'title': 'a title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostDetailViewTests(APITestCase):
    def setUp(self):
        dimitris = User.objects.create_user(
            username='dimitris',
            password='12345'
        )
        brian = User.objects.create_user(
            username='brian',
            password='12345'
        )
        Post.objects.create(
            owner=dimitris,
            title='a title',
            content='a content',
        )
        Post.objects.create(
            owner=brian,
            title='another title',
            content='another content',
        )

    def test_can_retrieve_post_using_valid_id(self):
        response = self.client.get('/posts/1/')
        self.assertEqual(response.data['title'], 'a title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_retrieve_post_using_invalid_id(self):
        response = self.client.get('/posts/333/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_post(self):
        self.client.login(username='dimitris', password='12345')
        response = self.client.put('/posts/1/', {'title': 'a new title'})
        post = Post.objects.filter(pk=1).first()
        self.assertEqual(post.title, 'a new title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_update_others_post(self):
        self.client.login(username='brian', password='12345')
        response = self.client.put('/posts/1/', {'title': 'a new title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)