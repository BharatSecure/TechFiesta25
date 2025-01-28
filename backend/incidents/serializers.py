from rest_framework import serializers
from .models import Incidents, User, Comment

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidents
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number'],
            aadhar_number=validated_data['aadhar_number'],
            email=validated_data['email'],
            password=validated_data['password'],
            address=validated_data['address'],
            emergency_contact1=validated_data['emergency_contact1'],
            emergency_contact2=validated_data['emergency_contact2']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CommentSerializer(serializers.ModelSerializer):
    commented_by_username = serializers.CharField(source='commented_by.first-name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'comment', 'file', 'commented_by', 'commented_by', 'commented_at', 'commented_on', 'useful']
        read_only_fields = ['id', 'commented_at', 'commented_by']