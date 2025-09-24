# Hướng dẫn Deploy Ứng dụng Lên Vercel (Dành cho người không biết code)

Chào bạn, đây là hướng dẫn chi tiết từng bước để bạn có thể đưa ứng dụng này lên mạng và sử dụng thông qua Vercel. Bạn không cần biết code, chỉ cần làm theo các bước dưới đây.

## Chuẩn bị

1.  **Tài khoản GitHub:** Nếu chưa có, bạn hãy tạo một tài khoản miễn phí tại [github.com](https://github.com).
2.  **Tài khoản Vercel:** Truy cập [vercel.com](https://vercel.com) và đăng ký một tài khoản miễn phí. Vercel cho phép bạn đăng nhập bằng tài khoản GitHub, đây là cách tiện nhất.
3.  **Mã API Key của Gemini:** Ứng dụng này cần một API Key từ Google AI Studio để hoạt động.
    *   Truy cập [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey).
    *   Nhấn vào nút "Create API key in new project".
    *   Sao chép (copy) mã API key này và lưu lại ở một nơi an toàn.

## Các bước thực hiện

### Bước 1: Đưa code lên GitHub

1.  **Tạo một kho chứa mới (repository):**
    *   Đăng nhập vào GitHub.
    *   Nhấn vào dấu `+` ở góc trên bên phải, chọn "New repository".
    *   Đặt tên cho repository, ví dụ: `vma-ticker-overlay`.
    *   Chọn "Public" (Công khai).
    *   Nhấn nút "Create repository".

2.  **Tải tất cả các file của dự án lên:**
    *   Trong trang repository vừa tạo, bạn sẽ thấy một mục có chữ "uploading an existing file". Hãy nhấn vào đó.
    *   Kéo và thả TẤT CẢ các file và thư mục (`public`, `src`, `index.html`, `metadata.json`, `README.md`, `vercel.json`) mà tôi đã cung cấp vào khu vực tải lên.
    *   Chờ tất cả các file được tải lên xong.
    *   Ở phía dưới, nhấn nút "Commit changes".

### Bước 2: Deploy lên Vercel

1.  **Tạo dự án mới trên Vercel:**
    *   Đăng nhập vào Vercel (bằng tài khoản GitHub).
    *   Bạn sẽ thấy trang Dashboard. Nhấn vào nút "Add New..." và chọn "Project".

2.  **Import dự án từ GitHub:**
    *   Vercel sẽ hiển thị danh sách các repository trên GitHub của bạn.
    *   Tìm repository bạn vừa tạo (`vma-ticker-overlay`) và nhấn nút "Import" bên cạnh nó.

3.  **Cấu hình dự án:**
    *   **Environment Variables (Biến môi trường):** Đây là bước QUAN TRỌNG NHẤT.
        *   Tìm đến mục "Environment Variables".
        *   Nhập `API_KEY` vào ô NAME (nhớ viết hoa và có dấu gạch dưới).
        *   Dán (paste) mã API Key của Gemini mà bạn đã lưu ở phần Chuẩn bị vào ô VALUE.
        *   Nhấn nút "Add".

    *   **Build & Development Settings:** Bạn có thể bỏ qua mục này. Tôi đã thêm một file `vercel.json` vào dự án để nó tự động cấu hình mọi thứ cho bạn.

4.  **Deploy:**
    *   Nhấn nút "Deploy".
    *   Vercel sẽ bắt đầu quá trình deploy. Quá trình này chỉ mất khoảng một phút.
    *   Khi hoàn tất, bạn sẽ thấy một màn hình chúc mừng. Nhấn vào ảnh thumbnail của trang web để truy cập ứng dụng của bạn!

## Hoàn tất

Bây giờ ứng dụng của bạn đã hoạt động trên một đường link công khai do Vercel cung cấp. Bạn có thể sử dụng đường link này trong OBS hoặc bất kỳ đâu bạn muốn.

Chúc bạn thành công!
