# Phê bình AI

Trong bài tập này, AI hỗ trợ tốt việc mở rộng không gian kiểm thử và tạo dữ liệu nhất quán, nhưng đầu ra ban đầu không thể dùng trực tiếp. Một số candidate đã suy đoán mã trạng thái theo thông lệ REST thay vì bám sát đặc tả. AI cũng tạo collection Postman có hai lỗi kỹ thuật: khai báo lại biến trong sandbox và ghép URL sai do thiếu ngoặc. Nếu không chạy thử và đọc Newman output, 120 ca có thể bị đánh giá sai vì lỗi của bộ kiểm thử chứ không phải lỗi SUT.

AI còn có xu hướng xem mọi khác biệt là bug. Cách xử lý code chỉ chứa khoảng trắng và việc xóa coupon đã có lịch sử sử dụng không được SRS quy định rõ; vì vậy hai trường hợp phải để REVIEW thay vì lập Issue. Ngược lại, các lỗi liên quan nhiều request như OTP dùng lại, giới hạn lượt coupon và định danh người dùng dễ bị bỏ sót nếu prompt chỉ mô tả từng endpoint độc lập. Các ca concurrency và time boundary cũng cần con người bổ sung vì AI chưa có trạng thái thực thi khi sinh candidate.

Nguyên tắc quan trọng nhất tôi rút ra là tách ba lớp: đặc tả làm oracle, AI tạo giả thuyết kiểm thử, và execution evidence xác nhận kết luận. Mỗi đầu ra AI cần được truy vết đến FR/SEC, chạy trên môi trường thật và rà soát failure trước khi gọi là bug. Cộng tác hiệu quả với AI không phải giao toàn bộ bài toán cho mô hình, mà là liên tục kiểm tra giả định, sửa công cụ và chịu trách nhiệm cho kết quả cuối cùng.
