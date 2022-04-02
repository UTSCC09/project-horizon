import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserPost, Comment, File, User } from 'src/app/models/post.model';

import { CommentApiService } from 'src/app/services/api/comment-api.service';
import { PostApiService } from 'src/app/services/api/post-api.service';
import { EngineManagerService } from 'src/app/services/engine-manager.service';
import { EngineService } from 'src/app/services/engine.service';
import { SceneControlService } from 'src/app/services/scene-control.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() post!: UserPost;

  private engineService: EngineService;
  private sceneController: SceneControlService;
  private user: User | null;
  commentText: string = '';

  commentLoading: boolean = false;
  showAddComment: boolean = false;
  renderEngine: boolean = false;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private commentApi: CommentApiService,
    private messageService: MessageService,
    private postApi: PostApiService,
    private em: EngineManagerService,
    private userService: UserService
  ) {
    this.commentApi = commentApi;
    this.postApi = postApi;
    this.messageService = messageService;
    this.user = this.userService.user;

    this.engineService = new EngineService(em);
    this.sceneController = this.engineService.sceneController;

    this.em.onEngineReset().subscribe((engine) => {
      if (engine == this.engineService) {
        this.renderEngine = false;
        this.canvas.nativeElement.classList.add('hidden');
      }
    })
  }

  get snapshot() {
    return this.post?.files?.filter(file => this.isImage(file))[0];
  }

  get scene() {
    return this.post?.files?.filter(file => file.mimetype === 'application/json')[0];
  }

  fileUrl(file?: File) {
    if (!file) {
      return '';
    }

    return `${environment.apiUrl}/${file.url}`;
  }

  fileType(file: File): string {
    return file.filename.split('.').pop() || '';
  }

  isImage(file: File): boolean {
    return file.mimetype.startsWith('image');
  }

  likeUnlikePost() {
    const updatePost = ({data}: any) => {
      this.post.liked = !this.post.liked;
    };

    const errored = (error: any) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    };

    if (this.post.liked) {
      this.postApi.unlikePost(this.post.id)
        .subscribe(updatePost, errored);
    } else {
      this.postApi.likePost(this.post.id)
        .subscribe(updatePost, errored);
    }
  }

  setupRenderer() {
    this.renderEngine = true;
    this.canvas.nativeElement.classList.remove('hidden');

    this.engineService.createScene(this.canvas);
    this.sceneController.setupControls();
    this.engineService.animate();
    fetch(this.fileUrl(this.scene))
      .then(res => res.blob())
      .then(async blob => {
        const file = new File([blob], this.scene?.filename || '', { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = (e) => {
          const scene = JSON.parse(reader.result as string);
          this.engineService.loadScene(scene);
        };

        reader.readAsText(file);
      });
  }

  toggleAddCommentDialog() {
    this.showAddComment = !this.showAddComment;
  }

  submitComment() {
    this.commentLoading = true;

    this.commentApi.addComment(this.post.id, this.commentText)
      .subscribe(({ data }) => {
          let comment = (data as any).createComment as Comment
          comment.user = this.post.user;

          this.post.comments = [comment, ...(this.post.comments || [])];

          this.showAddComment = false;
          this.commentText = '';
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        }),
        () => this.commentLoading = false;
  }

  date(date: string) {
    return new Date(date);
  }

  isMe() {
    return this.post.user.id === this.user?.id;
  }
}
